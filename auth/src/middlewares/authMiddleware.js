const jwt = require("jsonwebtoken");
const config = require("../config"); 

/**
 * Middleware to verify the token
 */

module.exports = function(req, res, next) { // Xuất một hàm middleware để xác minh token
  const token = req.header("x-auth-token"); // Lấy token từ tiêu đề yêu cầu

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" }); // Trả về lỗi nếu không có token
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret); // Xác minh token với bí mật JWT từ cấu hình
    req.user = decoded; // Gán thông tin người dùng đã giải mã vào yêu cầu
    next();// Tiếp tục đến middleware hoặc route handler tiếp theo
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" }); // Trả về lỗi nếu token không hợp lệ
  }
};
