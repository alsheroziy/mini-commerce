const { Router } = require("express");
const favouriteController = require("../controllers/favourite.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: User favourites
 */

/**
 * @swagger
 * /api/favourites:
 *   get:
 *     summary: Get user's favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of favourite products
 */
router.get("/", protect, favouriteController.getFavourites);

/**
 * @swagger
 * /api/favourites/clear:
 *   delete:
 *     summary: Clear all favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All favourites cleared
 */
router.delete("/clear", protect, favouriteController.clearFavourites);

/**
 * @swagger
 * /api/favourites/{productId}:
 *   post:
 *     summary: Add to favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Added to favourites
 *       409:
 *         description: Already in favourites
 */
router.post("/:productId", protect, favouriteController.addToFavourite);

/**
 * @swagger
 * /api/favourites/{productId}/check:
 *   get:
 *     summary: Check if product is in favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: "{ isFavourite: true/false }"
 */
router.get("/:productId/check", protect, favouriteController.checkFavourite);

/**
 * @swagger
 * /api/favourites/{productId}:
 *   delete:
 *     summary: Remove from favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed from favourites
 */
router.delete("/:productId", protect, favouriteController.removeFromFavourite);

module.exports = router;
