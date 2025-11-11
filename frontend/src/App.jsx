import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching /api/products...')
        const res = await axios.get('/api/products')
        console.log('Got products:', res.data)
        setProducts(res.data)
        setError(null)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>⚡</div>
          <div>
            <h1>ElectroMart</h1>
            <p>Premium Electrical Equipment & Supplies</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#667eea', marginTop: '20px' }}>Loading products...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={{ color: '#d32f2f', marginTop: '15px' }}>Connection Error</h3>
            <p style={{ color: '#d32f2f', marginTop: '10px' }}>
              {error}
            </p>
            <p style={{ color: '#999', marginTop: '10px', fontSize: '0.9rem' }}>
              Make sure the backend is running on http://localhost:5000
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{products.length}</div>
                <div style={styles.statLabel}>Products</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{products.filter(p => p.inStock).length}</div>
                <div style={styles.statLabel}>In Stock</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</div>
                <div style={styles.statLabel}>Total Value</div>
              </div>
            </div>

            {/* Products Grid */}
            <div style={styles.productsHeader}>
              <h2 style={{ color: 'white', marginBottom: 0 }}>Our Products</h2>
            </div>

            {products.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📦</div>
                <p>No products available</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {products.map((p) => (
                  <div key={p._id} style={styles.productCard}>
                    {/* Stock Badge */}
                    <div style={{
                      ...styles.badge,
                      backgroundColor: p.inStock ? '#4caf50' : '#f44336'
                    }}>
                      {p.inStock ? '✓ In Stock' : 'Out of Stock'}
                    </div>

                    {/* Product Icon */}
                    <div style={styles.productIcon}>⚡</div>

                    {/* Product Info */}
                    <h3 style={styles.productName}>{p.name}</h3>
                    <p style={styles.productDescription}>{p.description}</p>

                    {/* Price */}
                    <div style={styles.priceContainer}>
                      <span style={styles.price}>${p.price}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button style={styles.addButton}>
                      🛒 Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2025 ElectroMart. All rights reserved. | Built with React + Node.js</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  header: {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '40px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  logo: {
    fontSize: '3rem',
    lineHeight: '1',
  },

  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '40px 20px',
  },

  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },

  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },

  errorContainer: {
    background: 'white',
    borderRadius: '15px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },

  errorIcon: {
    fontSize: '3rem',
  },

  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },

  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },

  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '10px',
  },

  statLabel: {
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: '500',
  },

  productsHeader: {
    marginBottom: '30px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
  },

  productCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },

  badge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    zIndex: 10,
  },

  productIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
    textAlign: 'center',
  },

  productName: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
    marginTop: 0,
  },

  productDescription: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '15px',
  },

  priceContainer: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },

  price: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#667eea',
  },

  addButton: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },

  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
  },

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },

  footer: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.9rem',
  },
}
