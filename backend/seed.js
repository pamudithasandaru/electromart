const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: 'LED Bulb 60W',
    description: 'Bright and energy-efficient LED bulb. Lasts up to 25,000 hours.',
    price: 12.99,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400'
  },
  {
    name: 'Circuit Breaker 20A',
    description: 'Double pole circuit breaker for household electrical systems.',
    price: 25.50,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'
  },
  {
    name: 'Electrical Wire 10m',
    description: 'Copper electrical wire, 2.5mm thickness, 10 meters roll.',
    price: 18.75,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400'
  },
  {
    name: 'Power Outlet',
    description: 'Standard dual socket outlet with safety features.',
    price: 8.99,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Solar Panel 100W',
    description: 'Monocrystalline solar panel for residential use.',
    price: 199.99,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400'
  },
  {
    name: 'Battery Backup UPS 1000VA',
    description: 'Uninterruptible power supply for critical equipment.',
    price: 89.50,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  }
];

async function seedDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${inserted.length} sample products`);

    await mongoose.connection.close();
    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedDb();
