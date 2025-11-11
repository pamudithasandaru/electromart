import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products')
        setProducts(res.data)
      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>ElectroMart</h1>
      <p>A tiny e-commerce demo for electrical equipment.</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {products.length === 0 && <div>No products yet. Add some via API.</div>}
          {products.map((p) => (
            <div key={p._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{p.name}</h3>
              <div style={{ fontSize: 14, color: '#444' }}>{p.description}</div>
              <div style={{ marginTop: 8, fontWeight: '600' }}>${p.price}</div>
              <div style={{ marginTop: 6, color: p.inStock ? 'green' : 'red' }}>{p.inStock ? 'In stock' : 'Out of stock'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
