const mongoose = require("mongoose");
const Product = require("../models/product");

/**
 * Class that contains the business logic for the product repository interacting with the product model
 */
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
// });

// const Product = mongoose.model("Product", productSchema);

class ProductsRepository {
  async create(product) {
    const createdProduct = await Product.create(product); // tao san pham moi
    return createdProduct.toObject(); // tra ve doi tuong thuong
  }

  async findById(productId) {
    const product = await Product.findById(productId).lean(); // tim kiem san pham theo id
    return product;
  }

  async findAll() {
    const products = await Product.find().lean(); // lay tat ca san pham lean de tra ve doi tuong thuong
    return products;
  }
}

module.exports = ProductsRepository;
