import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const PORT = 5000;

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


app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
