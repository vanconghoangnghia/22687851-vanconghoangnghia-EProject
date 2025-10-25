const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({ 
  products: [{
    type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến mô hình sản phẩm
    ref: 'products', // Tên mô hình sản phẩm
    required: true, // Sản phẩm là bắt buộc
  }],
  totalPrice: { // Tổng giá trị đơn hàng
    type: Number,
    required: true,
    min: 0, 
  },
  createdAt: { 
    type: Date,
    default: Date.now, // Mặc định là thời gian hiện tại khi tạo đơn hàng
  },
}, { collection : 'orders' }); // Chỉ định tên bộ sưu tập là 'orders'

const Order = mongoose.model('Order', orderSchema); // Tạo mô hình Order từ lược đồ orderSchema

module.exports = Order;
