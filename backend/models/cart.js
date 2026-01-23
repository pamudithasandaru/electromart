const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total price
cartSchema.methods.getTotalPrice = function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get total items count
cartSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
