const categoryService = require("../services/category.service");
const { sendSuccess, sendError } = require("../utils/response");

const getCategories = async (_req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return sendSuccess(res, categories, "Categories fetched");
  } catch (error) {
    return sendError(res, error.message || "Error fetching categories");
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return sendError(res, "Category not found", 404);
    return sendSuccess(res, category, "Category fetched");
  } catch (error) {
    return sendError(res, error.message || "Error fetching category");
  }
};

const createCategory = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const category = await categoryService.createCategory({ ...req.body, ...(image && { image }) });
    return sendSuccess(res, category, "Category created", 201);
  } catch (error) {
    const msg = error.message || "Error creating category";
    return sendError(res, msg, msg.includes("already exists") ? 409 : 500);
  }
};

const updateCategory = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = { ...req.body, ...(image && { image }) };
    const category = await categoryService.updateCategory(req.params.id, data);
    if (!category) return sendError(res, "Category not found", 404);
    return sendSuccess(res, category, "Category updated");
  } catch (error) {
    return sendError(res, error.message || "Error updating category");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) return sendError(res, "Category not found", 404);
    return sendSuccess(res, null, "Category deleted");
  } catch (error) {
    return sendError(res, error.message || "Error deleting category");
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
