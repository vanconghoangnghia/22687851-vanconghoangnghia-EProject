const bcrypt = require("bcryptjs"); // Thư viện để băm và so sánh mật khẩu
const jwt = require("jsonwebtoken"); // Thư viện để tạo và xác minh JSON Web Tokens (JWT)
const UserRepository = require("../repositories/userRepository"); // Nhập kho lưu trữ người dùng
const config = require("../config"); // Nhập cấu hình ứng dụng
const User = require("../models/user"); // Nhập mô hình người dùng

/**
 * Class to hold the business logic for the auth service interacting with the user repository
 */
class AuthService {
  constructor() {
    this.userRepository = new UserRepository(); // Tạo một thể hiện mới của UserRepository
  }

  async findUserByUsername(username) { // Phương thức để tìm người dùng theo tên đăng nhập
    const user = await User.findOne({ username }); // Tìm người dùng trong cơ sở dữ liệu theo tên đăng nhập
    return user;
  }

  async login(username, password) {
    const user = await this.userRepository.getUserByUsername(username); // Lấy người dùng từ kho lưu trữ theo tên đăng nhập

    if (!user) {
      return { success: false, message: "Invalid username or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {// Kiểm tra nếu mật khẩu không khớp
      return { success: false, message: "Invalid username or password" };
    }
    // const token = jwt.sign({ id: user._id }, config.jwtSecret); // Tạo JWT với ID người dùng
    // const token = jwt.sign({ id: user._id }, config.jwtSecret,{ expiresIn: "1h" } ); // Tạo JWT với ID người dùng và thời gian hết hạn
    const token = jwt.sign({ id: user._id, username: user.username }, config.jwtSecret);// Tạo JWT với ID và tên người dùng


    return { success: true, token }; // Trả về thành công và token
  }

  async register(user) { // Phương thức để đăng ký người dùng mới
    const salt = await bcrypt.genSalt(10); // Tạo muối để băm mật khẩu
    user.password = await bcrypt.hash(user.password, salt); // Băm mật khẩu người dùng với muối

    return await this.userRepository.createUser(user); // Tạo người dùng mới trong kho lưu trữ
  }

  async deleteTestUsers() { 
    // Delete all users with a username that starts with "test"
    await User.deleteMany({ username: /^test/ });
  }
}

module.exports = AuthService; // Xuất lớp AuthService để sử dụng trong các phần khác của ứng dụng
