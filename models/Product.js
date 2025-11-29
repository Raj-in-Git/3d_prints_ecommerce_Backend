const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  material: { type: String, required: true },
  customizable: { type: Boolean, default: false },
  images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
