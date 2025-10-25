const mongoose = require("mongoose"); // Thư viện Mongoose để làm việc với MongoDB

const UserSchema = new mongoose.Schema({ // Định nghĩa lược đồ người dùng
  username: {
    type: String,
    required: true // Tên người dùng là bắt buộc
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema); // Xuất mô hình người dùng để sử dụng trong các phần khác của ứng dụng