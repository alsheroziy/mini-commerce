const favouriteService = require("../services/favourite.service");
const { sendSuccess, sendError } = require("../utils/response");

const getFavourites = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const result = await favouriteService.getFavourites(req.user.id, page, limit);
    return sendSuccess(res, result.favourites, "Favourites fetched", 200, result.pagination);
  } catch (error) {
    return sendError(res, error.message || "Error fetching favourites");
  }
};

const addToFavourite = async (req, res) => {
  try {
    const favourite = await favouriteService.addToFavourite(req.user.id, req.params.productId);
    return sendSuccess(res, favourite, "Added to favourites", 201);
  } catch (error) {
    const msg = error.message || "Error adding to favourites";
    return sendError(res, msg, msg.includes("already") ? 409 : 500);
  }
};

const removeFromFavourite = async (req, res) => {
  try {
    const removed = await favouriteService.removeFromFavourite(req.user.id, req.params.productId);
    if (!removed) return sendError(res, "Favourite not found", 404);
    return sendSuccess(res, null, "Removed from favourites");
  } catch (error) {
    return sendError(res, error.message || "Error removing from favourites");
  }
};

const checkFavourite = async (req, res) => {
  try {
    const isFavourite = await favouriteService.checkIsFavourite(req.user.id, req.params.productId);
    return sendSuccess(res, { isFavourite }, "Favourite status checked");
  } catch (error) {
    return sendError(res, error.message || "Error checking favourite");
  }
};

const clearFavourites = async (req, res) => {
  try {
    const count = await favouriteService.clearFavourites(req.user.id);
    return sendSuccess(res, { deletedCount: count }, "Favourites cleared");
  } catch (error) {
    return sendError(res, error.message || "Error clearing favourites");
  }
};

module.exports = { getFavourites, addToFavourite, removeFromFavourite, checkFavourite, clearFavourites };
