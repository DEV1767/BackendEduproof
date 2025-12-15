import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";
import Hr from "../models/hr.model.js";
import Institute from "../models/institute.model.js";
import { Apierror } from "../utils/apierror.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new Apierror(401, "Unauthorized");
        }

        let decoded, user;

        try {
            decoded = jwt.verify(token, process.env.Student_Access_Token_Secret);
            user = await Student.findById(decoded._id).select("-password");
        } catch { }

        if (!user) {
            try {
                decoded = jwt.verify(token, process.env.Hr_Access_Token_Secret);
                user = await Hr.findById(decoded._id).select("-password");
            } catch { }
        }

        if (!user) {
            try {
                decoded = jwt.verify(token, process.env.Institute_Access_Token_Secret);
                user = await Institute.findById(decoded._id).select("-password");
            } catch { }
        }

        if (!user) {
            throw new Apierror(401, "Invalid token");
        }

        req.user = user;
        req.user.role = decoded.role;

        next();
    } catch (error) {
        next(error);
    }
};

export { verifyJWT }