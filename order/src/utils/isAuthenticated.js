const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAuthenticated(req, res, next) { // kiểm tra xác thực người dùng
  // Check for the presence of an authorization header
  const authHeader = req.headers.authorization; // Lấy header xác thực từ yêu cầu
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' }); //không có header xác thực
  } 

  // Extract the token from the header
  const token = authHeader.split(' ')[1]; // Nếu thay 0 = 1 thì sẽ hiện thị "Bearer" thay vì token

  try {
    // Verify the token using the JWT library and the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    req.user = decodedToken; // Gán thông tin người dùng đã giải mã vào yêu cầu
    next(); // Tiếp tục đến middleware hoặc route handler tiếp theo
  } catch (err) {
    console.error(err); // Log lỗi nếu có
    return res.status(401).json({ message: 'Unauthorized' }); // Trả về lỗi nếu token không hợp lệ
  }
}

module.exports = isAuthenticated;
