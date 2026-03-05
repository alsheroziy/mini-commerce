const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         brand:
 *           type: string
 *         stock:
 *           type: integer
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         ratings:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *             count:
 *               type: integer
 *         isActive:
 *           type: boolean
 *         isFeatured:
 *           type: boolean
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: { type: String, unique: true, lowercase: true },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    discountPrice: { type: Number, default: null },
    images: { type: [String], default: [] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: { type: String, default: null },
    stock: { type: Number, default: 0, min: 0 },
    variants: [
      {
        size: String,
        color: String,
        stock: { type: Number, default: 0 },
        price: { type: Number, default: null },
      },
    ],
    tags: { type: [String], default: [] },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug =
      this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") +
      "-" +
      Date.now();
  }
});

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1, isActive: 1 });

module.exports = mongoose.model("Product", productSchema);
