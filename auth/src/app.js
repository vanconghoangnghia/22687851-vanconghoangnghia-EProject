const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const AuthController = require("./controllers/authController");

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController(); // Tạo thể hiện của AuthController
    this.connectDB(); // Kết nối đến cơ sở dữ liệu MongoDB
    this.setMiddlewares(); // Thiết lập các middleware
    this.setRoutes(); // Thiết lập các tuyến đường
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true, // Sử dụng trình phân tích cú pháp URL mới
      useUnifiedTopology: true, // Sử dụng công cụ quản lý kết nối mới
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  setMiddlewares() { // Thiết lập các middleware
    this.app.use(express.json()); // Phân tích cú pháp JSON trong yêu cầu
    this.app.use(express.urlencoded({ extended: false })); // Phân tích cú pháp URL-encoded trong yêu cầu
  }

  setRoutes() { // Thiết lập các tuyến đường
    this.app.post("/login", (req, res) => this.authController.login(req, res)); // Định nghĩa tuyến đường đăng nhập
    this.app.post("/register", (req, res) => this.authController.register(req, res));
    this.app.get("/dashboard", authMiddleware, (req, res) => res.json({ message: "Welcome to dashboard" }));
  }

  start() {
    this.server = this.app.listen(3000, () => console.log("Server started on port 3000")); // Bắt đầu máy chủ trên cổng 3000
  }

  async stop() { // Dừng máy chủ và ngắt kết nối cơ sở dữ liệu
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App; // Xuất lớp App để sử dụng trong các phần khác của ứng dụng
