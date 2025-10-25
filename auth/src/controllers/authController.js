const AuthService = require("../services/authService"); // Import dịch vụ xác thực

/**
 * Class to encapsulate the logic for the auth routes
 */

class AuthController {
  constructor() {
    this.authService = new AuthService(); // Tạo một thể hiện mới của AuthService
  }

  async login(req, res) { 
    const { username, password } = req.body; // Lấy tên đăng nhập và mật khẩu từ yêu cầu
 
    const result = await this.authService.login(username, password); // Gọi phương thức đăng nhập của dịch vụ xác thực

    if (result.success) {
      res.json({ token: result.token }); // Trả về token nếu đăng nhập thành công
    } else {
      res.status(400).json({ message: result.message }); // Trả về lỗi nếu đăng nhập thất bại
    }
  }

  async register(req, res) {
    const user = req.body; // Lấy thông tin người dùng từ yêu cầu
   
    try {
      const existingUser = await this.authService.findUserByUsername(user.username); // Kiểm tra nếu tên đăng nhập đã tồn tại
  
      if (existingUser) {
        console.log("Username already taken")
        throw new Error("Username already taken");
      }
  
      const result = await this.authService.register(user); // Gọi phương thức đăng ký của dịch vụ xác thực
      res.json(result); // Trả về kết quả đăng ký thành công
    } catch (err) {
      res.status(400).json({ message: err.message }); // Trả về lỗi nếu đăng ký thất bại
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id; // Lấy ID người dùng từ yêu cầu (giả sử đã được xác thực)

    try {
      const user = await this.authService.getUserById(userId); // Gọi phương thức để lấy thông tin người dùng theo ID
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
