const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *           example: "XL"
 *         color:
 *           type: string
 *           example: "Red"
 *         stock:
 *           type: integer
 *           example: 10
 *         price:
 *           type: number
 *           nullable: true
 *           example: 320000
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d3"
 *         name:
 *           type: string
 *           example: "Nike Air Max 270"
 *         slug:
 *           type: string
 *           example: "nike-air-max-270-1700000000000"
 *         description:
 *           type: string
 *           example: "Comfortable running shoes with Air Max cushioning."
 *         price:
 *           type: number
 *           example: 350000
 *         discountPrice:
 *           type: number
 *           nullable: true
 *           example: 300000
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["/uploads/nike-1.jpg", "/uploads/nike-2.jpg"]
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         brand:
 *           type: string
 *           nullable: true
 *           example: "Nike"
 *         stock:
 *           type: integer
 *           example: 45
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["sport", "running", "sale"]
 *         ratings:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *               example: 4.5
 *             count:
 *               type: integer
 *               example: 128
 *         isActive:
 *           type: boolean
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-20T12:00:00.000Z"
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
