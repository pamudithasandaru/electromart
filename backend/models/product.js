const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('Product', productSchema);
