import Student from "../models/student.model.js";
import Hr from "../models/hr.model.js";
import Institute from "../models/institute.model.js";

/* =======================
   GET LOGGED IN USER
======================= */
export const getme = async (req, res) => {
    try {
        const user = req.user;

        const response = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // STUDENT
        if (user.role === "student") {
            response.student = {
               studentname:user.name,
               email:user.email,
                studentId: user.studentId,
                institutionname: user.institutionname,
                //certificateEarned: user.certificateEarned
            };
        }

        // INSTITUTE
        if (user.role === "institute") {
            response.institute = {
                instituteId: user.instituteId,
                institutename: user.name,
                //certificateIssued: user.certificateIssued
            };
        }

        // HR
        if (user.role === "hr") {
            response.hr = {
                hrId: user.hrId,
                companyname: user.companyname
            };
        }

        return res.status(200).json({
            success: true,
            user: response
        });

    } catch (error) {
        console.error("GET ME ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details"
        });
    }
};


/* =======================
   GET PROFILE (DETAILED)
======================= */
export const getprofile = async (req, res) => {
    try {
        const user = req.user;

        const profile = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // STUDENT PROFILE
        if (user.role === "student") {
            profile.student = {
                studentId: user.studentId,
                institutionname: user.institutionname,
                //certificateEarned: user.certificateEarned
            };
        }

        // INSTITUTE PROFILE
        if (user.role === "institute") {
            profile.institute = {
                instituteId: user.instituteId,
                institutename: user.name,
                blockchainwallet: user.blockchainwallet,
               // certificateIssued: user.certificateIssued
            };
        }

        // HR PROFILE
        if (user.role === "hr") {
            profile.hr = {
                hrId: user.hrId,
                companyname: user.companyname
            };
        }

        return res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};


