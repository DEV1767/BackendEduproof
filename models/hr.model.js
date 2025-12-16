import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hrSchema = new Schema(
    {
        hrId: {
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
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },
        companyname: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
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
hrSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

/* ================= PASSWORD CHECK ================= */
hrSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

/* ================= ACCESS TOKEN ================= */
hrSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: "hr"
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

/* ================= REFRESH TOKEN ================= */
hrSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: "hr"
        },
        process.env.HR_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
};

export default mongoose.model("Hr", hrSchema);

