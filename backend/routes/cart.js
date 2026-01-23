const express = require('express');
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');
const Product = require('../models/product');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Please login.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Get user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems()
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve cart' 
    });
  }
});

// Add item to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems()
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add item to cart' 
    });
  }
});

// Update item quantity
router.put('/update/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid quantity is required' 
      });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({
      success: true,
      message: 'Quantity updated',
      cart: {
        items: cart.items,
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems()
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update cart' 
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems()
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove item' 
    });
  }
});

// Checkout (clear cart)
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    const totalAmount = cart.getTotalPrice();
    const itemCount = cart.getTotalItems();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Payment successful! Your order has been placed.',
      orderSummary: {
        totalAmount,
        itemCount
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process checkout' 
    });
  }
});

module.exports = router;
