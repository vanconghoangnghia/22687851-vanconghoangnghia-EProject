const express = require("express"); // framework web nhẹ cho Node.js
const httpProxy = require("http-proxy"); //  giup chuyển tiếp các yêu cầu HTTP đến các dịch vụ khác nhau

const proxy = httpProxy.createProxyServer(); // Tạo một máy chủ proxy
const app = express(); // Tạo một ứng dụng Express

app.use("/auth", (req, res) => {
  // Khi có yêu cầu đến /auth, chuyển tiếp đến dịch vụ auth
  proxy.web(req, res, { target: "http://auth:3000" }); // Chuyển tiếp yêu cầu đến dịch vụ auth
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "http://product:3001" });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "http://order:3002" });
});

const port = process.env.PORT || 3003; // Cổng mà API Gateway sẽ lắng nghe
app.listen(port, () => {
  // Bắt đầu lắng nghe các yêu cầu trên cổng đã chỉ định
  console.log(`API Gateway listening on port ${port}`); // In thông báo khi máy chủ bắt đầu chạy
});
