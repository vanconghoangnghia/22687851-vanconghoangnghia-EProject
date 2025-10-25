require("dotenv").config(); // Load biến môi trường từ file .env

module.exports = { // Xuất cấu hình để sử dụng trong các phần khác của ứng dụng
  mongoURI: process.env.MONGODB_AUTH_URI, // Chuỗi kết nối đến cơ sở dữ liệu MongoDB
  jwtSecret: process.env.JWT_SECRET || "secret",// Bí mật dùng để ký và xác minh JSON Web Tokens (JWT)
};
