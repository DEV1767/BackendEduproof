import Student from "../models/student.model.js";
import Hr from "../models/hr.model.js";
import Institute from "../models/institute.model.js";
import { Apierror } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponce.js";
import jwt from "jsonwebtoken";
import { generateId } from "../utils/generateId.js";

/* ================= REGISTER ================= */
const registerUser = async (req, res) => {
    const { role, data } = req.body;

    if (!role || !data) {
        throw new Apierror(400, "Role and data are required");
    }

    let user;

    if (role === "student") {
        const { email, password, name, institutionname } = data;

        if (!email || !password || !name || !institutionname) {
            throw new Apierror(400, "All student fields are required");
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
        const { email, password, name, companyname } = data;

        if (!email || !password || !name || !companyname) {
            throw new Apierror(400, "All HR fields are required");
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
            companyname
        });
    }

    else if (role === "institute") {
        const { email, password, name } = data;

        if (!email || !password || !name) {
            throw new Apierror(400, "All institute fields are required");
        }

        if (await Institute.findOne({ email })) {
            throw new Apierror(409, "Institute already exists");
        }

        const instituteId = await generateId(Institute, "INS", "instituteId");

        user = await Institute.create({
            instituteId,
            email,
            password,
            name,

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
        throw new Apierror(400, "Role, email and password are required");
    }

    let user;

    if (role === "student") {
        user = await Student.findOne({ email });
    }
    else if (role === "hr") {
        user = await Hr.findOne({ email });
    }
    else if (role === "institute") {
        user = await Institute.findOne({ email });
    }
    else {
        throw new Apierror(400, "Invalid role");
    }

    if (!user) {
        throw new Apierror(404, `${role} not found`);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid credentials");
    }

    // 🔐 SINGLE ACCESS TOKEN SECRET
    const accessToken = jwt.sign(
        {
            _id: user._id,
            role,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    // 🔁 KEEP refresh token role-based (OK)
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true
        })
        .json(
            new ApiResponse(
                200,
                { role },
                "Login successful"
            )
        );
};


/* ================= REFRESH ================= */
const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new Apierror(401, "Refresh token missing");
    }

    let decoded, user, role;

    try {
        decoded = jwt.verify(refreshToken, process.env.STUDENT_REFRESH_TOKEN_SECRET);
        user = await Student.findById(decoded._id);
        role = "student";
    } catch { }

    if (!user) {
        try {
            decoded = jwt.verify(refreshToken, process.env.HR_REFRESH_TOKEN_SECRET);
            user = await Hr.findById(decoded._id);
            role = "hr";
        } catch { }
    }

    if (!user) {
        try {
            decoded = jwt.verify(refreshToken, process.env.INSTITUTE_REFRESH_TOKEN_SECRET);
            user = await Institute.findById(decoded._id);
            role = "institute";
        } catch { }
    }

    if (!user || user.refreshToken !== refreshToken) {
        throw new Apierror(401, "Invalid refresh token");
    }

    // 🔐 ISSUE NEW ACCESS TOKEN WITH SINGLE SECRET
    const newAccessToken = jwt.sign(
        {
            _id: user._id,
            role,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );

    return res
        .cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true
        })
        .json(
            new ApiResponse(200, { role }, "Token refreshed")
        );
};


/* ================= LOGOUT ================= */
const logoutUser = async (req, res) => {
    const { role, _id } = req.user;

    if (role === "student") await Student.findByIdAndUpdate(_id, { refreshToken: null });
    if (role === "hr") await Hr.findByIdAndUpdate(_id, { refreshToken: null });
    if (role === "institute") await Institute.findByIdAndUpdate(_id, { refreshToken: null });

    return res.clearCookie("accessToken").clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "Logged out"));
};

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
};


