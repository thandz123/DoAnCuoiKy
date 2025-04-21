// models/Foods.js
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  image: String,
  description: String,
  category: String,
  price: Number
}, { versionKey: false });

const Food = mongoose.model("Food", foodSchema);

module.exports = Food; 
