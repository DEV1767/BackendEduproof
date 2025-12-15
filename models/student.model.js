import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const StudentSchema = new Schema(
    {
        studentId: {
            type: String,
            unique: true,
            required: true,
            immutable: true
        },
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        institutionname: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        certificateEarned: {
            type: Number,
            default: 0
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: String,
        forgotpassToken: String,
        forgotpassExpiry: Date
    },
    { timestamps: true }
);

/* ================= PASSWORD HASH (FIXED) ================= */
StudentSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

/* ================= PASSWORD CHECK ================= */
StudentSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

/* ================= ACCESS TOKEN ================= */
StudentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: "student"
        },
        process.env.STUDENT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

/* ================= REFRESH TOKEN ================= */
StudentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: "student"
        },
        process.env.STUDENT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export default mongoose.model("Student", StudentSchema);
