const productService = require("../services/product.service");
const { sendSuccess, sendError } = require("../utils/response");

const getProducts = async (req, res) => {
  try {
    const {
      category, minPrice, maxPrice, brand, search,
      isFeatured, tags, inStock, page, limit, sortBy, sortOrder,
    } = req.query;

    const filters = {
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brand,
      search,
      isFeatured: isFeatured === "true" ? true : isFeatured === "false" ? false : undefined,
      tags: tags ? tags.split(",") : undefined,
      inStock: inStock === "true",
      page: page ? Number(page) : 1,
      limit: limit ? Math.min(Number(limit), 50) : 10,
      sortBy: sortBy || "createdAt",
      sortOrder: sortOrder || "desc",
    };

    const result = await productService.getProducts(filters);
    return sendSuccess(res, result.products, "Products fetched", 200, result.pagination);
  } catch (error) {
    return sendError(res, error.message || "Error fetching products");
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return sendError(res, "Product not found", 404);
    return sendSuccess(res, product, "Product fetched");
  } catch (error) {
    return sendError(res, error.message || "Error fetching product");
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) return sendError(res, "Product not found", 404);
    return sendSuccess(res, product, "Product fetched");
  } catch (error) {
    return sendError(res, error.message || "Error fetching product");
  }
};

const getFeaturedProducts = async (_req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    return sendSuccess(res, products, "Featured products fetched");
  } catch (error) {
    return sendError(res, error.message || "Error fetching featured products");
  }
};

const createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const product = await productService.createProduct({ ...req.body, images });
    return sendSuccess(res, product, "Product created", 201);
  } catch (error) {
    return sendError(res, error.message || "Error creating product");
  }
};

const updateProduct = async (req, res) => {
  try {
    const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const data = { ...req.body };
    if (newImages.length > 0) data.images = newImages;

    const product = await productService.updateProduct(req.params.id, data);
    if (!product) return sendError(res, "Product not found", 404);
    return sendSuccess(res, product, "Product updated");
  } catch (error) {
    return sendError(res, error.message || "Error updating product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return sendError(res, "Product not found", 404);
    return sendSuccess(res, null, "Product deleted");
  } catch (error) {
    return sendError(res, error.message || "Error deleting product");
  }
};

module.exports = {
  getProducts, getProductById, getProductBySlug,
  getFeaturedProducts, createProduct, updateProduct, deleteProduct,
};
