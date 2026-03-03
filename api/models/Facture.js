const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  label:      { type: String, required: true },
  type:       { type: String, default: "text" },
  x:          { type: Number, required: true },
  y:          { type: Number, required: true },
  fontSize:   { type: String, default: "14px" },
  color:      { type: String, default: "#000000" },
  fontWeight: { type: Number, default: 400 },
  align:      { type: String, default: "left" },
});

const FactureSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    image:  { type: String, required: true }, // chemin relatif ex: "uploads/template1.png"
    fields: [FieldSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facture", FactureSchema);