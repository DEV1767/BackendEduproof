import app from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.Mongo_url);
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

export default async function handler(req, res) {
    await connectDB();
    return app(req, res);
}
