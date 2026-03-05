const { Router } = require("express");
const favouriteController = require("../controllers/favourite.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: Manage the current user's favourite products
 */

/**
 * @swagger
 * /api/favourites:
 *   get:
 *     summary: Get current user's favourite products
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of favourite products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Favourites fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Favourite'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", protect, favouriteController.getFavourites);

/**
 * @swagger
 * /api/favourites/clear:
 *   delete:
 *     summary: Remove all products from favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All favourites cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Favourites cleared"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedCount:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/clear", protect, favouriteController.clearFavourites);

/**
 * @swagger
 * /api/favourites/{productId}:
 *   post:
 *     summary: Add a product to favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ObjectId
 *         example: "64a1f2b3c4d5e6f7a8b9c0d3"
 *     responses:
 *       201:
 *         description: Product added to favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Added to favourites"
 *                 data:
 *                   $ref: '#/components/schemas/Favourite'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Product already in favourites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Product already in favourites"
 */
router.post("/:productId", protect, favouriteController.addToFavourite);

/**
 * @swagger
 * /api/favourites/{productId}/check:
 *   get:
 *     summary: Check if a product is in the user's favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64a1f2b3c4d5e6f7a8b9c0d3"
 *     responses:
 *       200:
 *         description: Favourite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Favourite status checked"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavourite:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:productId/check", protect, favouriteController.checkFavourite);

/**
 * @swagger
 * /api/favourites/{productId}:
 *   delete:
 *     summary: Remove a product from favourites
 *     tags: [Favourites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64a1f2b3c4d5e6f7a8b9c0d3"
 *     responses:
 *       200:
 *         description: Product removed from favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Removed from favourites"
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found in favourites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Favourite not found"
 */
router.delete("/:productId", protect, favouriteController.removeFromFavourite);

module.exports = router;
