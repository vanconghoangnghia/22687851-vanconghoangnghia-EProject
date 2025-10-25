const Product = require("../models/product");
const messageBroker = require("../utils/messageBroker"); // ket noi den message broker
const uuid = require("uuid"); // lấy thư viện uuid để tạo id duy nhất

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {
  constructor() {
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();
  }

  async createProduct(req, res, next) {
    try {
      const token = req.headers.authorization; // kiem tra token
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = new Product(req.body); // tao san pham moi

      const validationError = product.validateSync(); // kiem tra loi
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      await product.save({ timeout: 30000 }); // luu san pham voi thoi gian timeout la 30s

      res.status(201).json(product); // tra ve san pham da tao
    } catch (error) {
      // bat loi
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async createOrder(req, res, next) {
    // tao don hang
    try {
      const token = req.headers.authorization; // kiem tra token
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { ids } = req.body; // lay danh sach id san pham tu body
      const products = await Product.find({ _id: { $in: ids } }); // tim kiem san pham theo id

      const orderId = uuid.v4(); // Generate a unique order ID
      this.ordersMap.set(orderId, {
        // luu don hang vao map
        status: "pending",
        products,
        username: req.user.username,
      });

      await messageBroker.publishMessage("orders", {
        // gui tin nhan den queue orders
        products, // danh sach san pham
        username: req.user.username, //them username vao tin nhan
        orderId, // include the order ID in the message to orders queue
      });

      messageBroker.consumeMessage("products", (data) => {
        // lang nghe tin nhan tu queue products
        const orderData = JSON.parse(JSON.stringify(data)); // parse data tu json
        const { orderId } = orderData; // lay orderId tu data
        const order = this.ordersMap.get(orderId); // lay don hang tu map
        if (order) {
          // update the order in the map
          this.ordersMap.set(orderId, {
            ...order,
            ...orderData,
            status: "completed",
          }); // cap nhat don hang voi trang thai la completed
          console.log("Updated order:", order); // in ra don hang da cap nhat
        }
      });

      // Long polling until order is completed
      let order = this.ordersMap.get(orderId); // lay don hang tu map
      while (order.status !== "completed") {
        // trong khi trang thai don hang khong phai la completed
        await new Promise((resolve) => setTimeout(resolve, 1)); // wait for 1 second before checking status again // cho 1 giay
        order = this.ordersMap.get(orderId); // lay don hang tu map lai
      }

      // Once the order is marked as completed, return the complete order details
      return res.status(201).json(order); // tra ve don hang da tao
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getOrderStatus(req, res, next) {
    // lay trang thai don hang
    const { orderId } = req.params; // lay orderId tu params
    const order = this.ordersMap.get(orderId); // lay don hang tu map
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  }

  async getProducts(req, res, next) {
    // lay tat ca san pham
    try {
      const token = req.headers.authorization; // kiem tra token
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const products = await Product.find({}); // lay tat ca san pham

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = ProductController;
