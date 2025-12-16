import Student from "../models/student.model.js";
import Hr from "../models/hr.model.js";
import Institute from "../models/institute.model.js";

/* =======================
   GET LOGGED IN USER
======================= */
export const getme = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
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
        return res.status(200).json({
            success: true,
            profile: req.user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};
