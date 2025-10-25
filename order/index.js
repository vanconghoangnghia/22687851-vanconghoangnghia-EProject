require("dotenv").config();
const App = require("./src/app"); // import lớp App từ file app.js

const app = new App(); //tạo instance của lớp App
app.start();