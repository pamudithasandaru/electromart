const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /api/products - list products
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products called')
    const products = await Product.find().limit(50)
    console.log(`Found ${products.length} products`)
    res.json(products)
  } catch (err) {
    console.error('Error fetching products:', err.message)
    res.status(500).json({ error: 'Failed to fetch products', details: err.message })
  }
})

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
