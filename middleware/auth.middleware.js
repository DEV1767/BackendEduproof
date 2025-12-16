import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";
import Hr from "../models/hr.model.js";
import Institute from "../models/institute.model.js";
import { Apierror } from "../utils/apierror.js";


export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ success: false });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        let user;
        if (decoded.role === "student") {
            user = await Student.findById(decoded._id).select("-password");
        } else if (decoded.role === "hr") {
            user = await Hr.findById(decoded._id).select("-password");
        } else if (decoded.role === "institute") {
            user = await Institute.findById(decoded._id).select("-password");
        }

        if (!user) {
            return res.status(401).json({ success: false });
        }

        req.user = user;
        req.user.role = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ success: false });
    }
};
