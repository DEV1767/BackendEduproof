import Student from "../models/student.model.js";
import Hr from "../models/hr.model.js";
import Institute from "../models/institute.model.js";
import { Apierror } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponce.js";
import jwt from "jsonwebtoken";
import { generateId } from "../utils/generateId.js";
import { cookieOptions } from "../utils/cookieOptions.js";

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
    const { role, data } = req.body;

    if (!role || !data) {
        throw new Apierror(400, "Role and data required");
    }

    let user;

    if (role === "student") {
        const { email, password, name, institutionname } = data;
        if (!email || !password || !name || !institutionname) {
            throw new Apierror(400, "All fields required");
        }

        if (await Student.findOne({ email })) {
            throw new Apierror(409, "Student already exists");
        }

        const studentId = await generateId(Student, "STU", "studentId");

        user = await Student.create({
            studentId,
            email,
            password,
            name,
            institutionname
        });
    }

    else if (role === "hr") {
        const { email, password, name, companyname, companyName } = data;
        const finalCompany = companyname || companyName;

        if (!email || !password || !name || !finalCompany) {
            throw new Apierror(400, "All fields required");
        }

        if (await Hr.findOne({ email })) {
            throw new Apierror(409, "HR already exists");
        }

        const hrId = await generateId(Hr, "HR", "hrId");

        user = await Hr.create({
            hrId,
            email,
            password,
            name,
            companyname: finalCompany
        });
    }

    else if (role === "institute") {
        const { email, password, name } = data;
        if (!email || !password || !name) {
            throw new Apierror(400, "All fields required");
        }

        if (await Institute.findOne({ email })) {
            throw new Apierror(409, "Institute already exists");
        }

        const instituteId = await generateId(Institute, "INS", "instituteId");

        user = await Institute.create({
            instituteId,
            email,
            password,
            name
        });
    }

    else {
        throw new Apierror(400, "Invalid role");
    }

    return res.status(201).json(
        new ApiResponse(201, { id: user._id, role }, "Registered successfully")
    );
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
        throw new Apierror(400, "Role, email and password required");
    }

    let user;
    if (role === "student") user = await Student.findOne({ email });
    if (role === "hr") user = await Hr.findOne({ email });
    if (role === "institute") user = await Institute.findOne({ email });

    if (!user) throw new Apierror(404, "User not found");

    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) throw new Apierror(401, "Invalid credentials");

    const accessToken = jwt.sign(
        { _id: user._id, role, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { _id: user._id, role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { role }, "Login successful"));
};

/* ================= REFRESH ================= */
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new Apierror(401, "No refresh token");

    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    let user;
    if (decoded.role === "student") user = await Student.findById(decoded._id);
    if (decoded.role === "hr") user = await Hr.findById(decoded._id);
    if (decoded.role === "institute") user = await Institute.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
        throw new Apierror(401, "Invalid refresh token");
    }

    const newAccessToken = jwt.sign(
        {
            _id: user._id,
            role: decoded.role,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    return res
        .cookie("accessToken", newAccessToken, cookieOptions)
        .json(new ApiResponse(200, {}, "Token refreshed"));
};

/* ================= LOGOUT ================= */
const logoutUser = async (req, res) => {
    const { role, _id } = req.user;

    if (role === "student") await Student.findByIdAndUpdate(_id, { refreshToken: null });
    if (role === "hr") await Hr.findByIdAndUpdate(_id, { refreshToken: null });
    if (role === "institute") await Institute.findByIdAndUpdate(_id, { refreshToken: null });

    return res
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out"));
};

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
};
