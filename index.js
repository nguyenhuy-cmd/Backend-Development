import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config({
    path: "./config/.env"
});

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Kết nối MongoDB thành công");
})
.catch((err) => {
    console.log("Lỗi MongoDB:", err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${process.env.PORT}`);
});
