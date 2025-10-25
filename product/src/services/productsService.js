const ProductsRepository = require(".repositories/productsRepository");

/**
 * Class that ties together the business logic and the data access layer
 */
class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product) {
    const createdProduct = await this.productsRepository.create(product); // tao san pham moi
    return createdProduct;
  }

  async getProductById(productId) {
    const product = await this.productsRepository.findById(productId); // tim kiem san pham theo id
    return product;
  }

  async getProducts() {
    const products = await this.productsRepository.findAll(); // lay tat ca san pham
    return products;
  }
}

module.exports = ProductsService;
