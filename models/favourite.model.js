const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Favourite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d4"
 *         user:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-02-01T09:15:00.000Z"
 */
const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

favouriteSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
