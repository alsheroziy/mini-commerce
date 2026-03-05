const Favourite = require("../models/favourite.model");
const { buildPagination } = require("../utils/response");

const getFavourites = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [favourites, total] = await Promise.all([
    Favourite.find({ user: userId })
      .populate({
        path: "product",
        populate: { path: "category", select: "name slug" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Favourite.countDocuments({ user: userId }),
  ]);

  return { favourites, pagination: buildPagination(total, page, limit) };
};

const addToFavourite = async (userId, productId) => {
  const existing = await Favourite.findOne({ user: userId, product: productId });
  if (existing) throw new Error("Product already in favourites");
  return Favourite.create({ user: userId, product: productId });
};

const removeFromFavourite = async (userId, productId) => {
  const result = await Favourite.findOneAndDelete({ user: userId, product: productId });
  return !!result;
};

const checkIsFavourite = async (userId, productId) => {
  const exists = await Favourite.findOne({ user: userId, product: productId });
  return !!exists;
};

const clearFavourites = async (userId) => {
  const result = await Favourite.deleteMany({ user: userId });
  return result.deletedCount;
};

module.exports = {
  getFavourites,
  addToFavourite,
  removeFromFavourite,
  checkIsFavourite,
  clearFavourites,
};
