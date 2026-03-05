const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d2"
 *         name:
 *           type: string
 *           example: "Shoes"
 *         slug:
 *           type: string
 *           example: "shoes"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "All types of shoes"
 *         image:
 *           type: string
 *           nullable: true
 *           example: "/uploads/category-shoes.jpg"
 *         parent:
 *           nullable: true
 *           oneOf:
 *             - type: string
 *               example: null
 *             - $ref: '#/components/schemas/Category'
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-10T08:00:00.000Z"
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: { type: String, default: null },
    image: { type: String, default: null },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
});

module.exports = mongoose.model("Category", categorySchema);
