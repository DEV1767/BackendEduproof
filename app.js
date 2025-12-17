import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

/* ================= CORS ================= */
const corsOptions = {
    origin: [
        "https://blockchainbasedproject.vercel.app",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions)); // ✅ FIXED

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
});

app.use("/api/auth", authRoutes);

export default app;

