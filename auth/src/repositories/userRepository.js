const User = require("../models/user"); // Nhập mô hình người dùng

/**
 * Class to encapsulate the logic for the user repository
 */
class UserRepository { // Khai báo lớp UserRepository
  async createUser(user) { // Phương thức để tạo người dùng mới
    return await User.create(user); // Tạo và lưu người dùng mới vào cơ sở dữ liệu
  }

  async getUserByUsername(username) { // Phương thức để lấy người dùng theo tên đăng nhập
    return await User.findOne({ username });// Tìm người dùng trong cơ sở dữ liệu theo tên đăng nhập
  }
}

module.exports = UserRepository; // Xuất lớp UserRepository để sử dụng trong các phần khác của ứng dụng
