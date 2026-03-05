const Category = require("../models/category.model");

const getAllCategories = async (includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  return Category.find(filter).populate("parent", "name slug").sort({ name: 1 });
};

const getCategoryById = async (id) => {
  return Category.findById(id).populate("parent", "name slug");
};

const createCategory = async ({ name, description, image, parent }) => {
  const existing = await Category.findOne({ name });
  if (existing) throw new Error("Category with this name already exists");
  return Category.create({ name, description, image, parent });
};

const updateCategory = async (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteCategory = async (id) => {
  const result = await Category.findByIdAndDelete(id);
  return !!result;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
