import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();



//database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_url);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("DB error:", error);
        process.exit(1);
    }
};

connectDB();

