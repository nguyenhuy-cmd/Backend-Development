import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cors from "cors";
dotenv.config({
    path: "./config/.env"
});

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use('/public', express.static('public'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Kết nối MongoDB thành công");
})
.catch((err) => {
    console.log("Lỗi MongoDB:", err);
});


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Lỗi server'
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${process.env.PORT}`);
});
