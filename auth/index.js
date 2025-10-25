require("dotenv").config(); // Load biến môi trường từ file .env
const App = require("./src/app"); // Import lớp App từ tệp app.js trong thư mục src

const app = new App();// Tạo một thể hiện mới của lớp App
app.start();// Bắt đầu ứng dụng bằng cách gọi phương thức start của lớp App
