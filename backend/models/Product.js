const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    default: null,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
