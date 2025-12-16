import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// 🔥🔥 CORS MUST BE FIRST 🔥🔥
const corsOptions = {
    origin: [
        "https://blockchainbasedproject.vercel.app",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight support

// 🔽 body & cookies AFTER cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
});

// routes
app.use("/api/auth", authRoutes);

export default app;
