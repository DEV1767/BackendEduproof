import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: [
        "http://localhost:5500",
        "https://backend-eduproof-git-main-shivams-projects-5ccde8df.vercel.app"
    ],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
});

app.use("/api/auth", authRoutes);

export default app;
