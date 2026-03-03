const mongoose = require("mongoose");

const StockItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    group: String,
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    ordered: { type: Number, default: 0 },
    buyPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "ordered", "sold"],
      default: "available",
    },
    image: { type: String, default: "" },
    // Date à laquelle le status est passé à "sold"
    soldAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockItem", StockItemSchema);