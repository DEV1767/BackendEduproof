import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 CORS CONFIG
const corsOptions = {
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://blockchainbasedproject.vercel.app"
    ],
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 REQUIRED for preflight

app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
});

app.use("/api/auth", authRoutes);

export default app;
