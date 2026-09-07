const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
