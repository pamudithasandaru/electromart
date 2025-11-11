const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /api/products - list products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().limit(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - create product
router.post('/', async (req, res) => {
  try {
    const p = new Product(req.body);
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product data', details: err.message });
  }
});

module.exports = router;
