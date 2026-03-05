const Product = require("../models/product.model");
const { buildPagination } = require("../utils/response");

const getProducts = async (filters = {}) => {
  const {
    category,
    minPrice,
    maxPrice,
    brand,
    search,
    isFeatured,
    tags,
    inStock,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = filters;

  const query = { isActive: true };

  if (category) query.category = category;
  if (brand) query.brand = { $regex: brand, $options: "i" };
  if (isFeatured !== undefined) query.isFeatured = isFeatured;
  if (inStock) query.stock = { $gt: 0 };
  if (tags && tags.length > 0) query.tags = { $in: tags };

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return { products, pagination: buildPagination(total, page, limit) };
};

const getProductById = async (id) => {
  return Product.findById(id).populate("category", "name slug");
};

const getProductBySlug = async (slug) => {
  return Product.findOne({ slug, isActive: true }).populate("category", "name slug");
};

const createProduct = async (data) => {
  return Product.create(data);
};

const updateProduct = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
    "category",
    "name slug"
  );
};

const deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id);
  return !!result;
};

const getFeaturedProducts = async (limit = 8) => {
  return Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name slug")
    .limit(limit)
    .lean();
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
};
