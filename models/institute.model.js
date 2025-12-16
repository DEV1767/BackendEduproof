import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const InstituteSchema = new Schema(
    {
        instituteId: {
            type: String,
            required: true,
            unique: true,
            immutable: true
        },
        name: {
            type: String,
            required: true,
            unique: true,
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
        blockchainwallet: {
            type: String,
            required: false,
            unique: true,
            trim: true
        },
        certificateIssued: {
            type: Number,
            default: 0
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

/* ================= PASSWORD HASH (FIXED) ================= */
InstituteSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

/* ================= PASSWORD CHECK ================= */
InstituteSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

/* ================= ACCESS TOKEN ================= */
InstituteSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: "institute"
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

/* ================= REFRESH TOKEN ================= */
InstituteSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: "institute"
        },
        process.env.INSTITUTE_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export default mongoose.model("Institute", InstituteSchema);

