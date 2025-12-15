import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
//test
app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
});

export default app;
