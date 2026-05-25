const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({
    path: "./config/.env"
});

const app = express();

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
