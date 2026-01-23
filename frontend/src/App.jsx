import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AuthModal from './AuthModal'
import Cart from './Cart'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cartData, setCartData] = useState({ items: [], totalPrice: 0, totalItems: 0 })

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      fetchCart()
    }
  }, [])

  // Fetch user's cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.data.success) {
        setCartData(res.data.cart)
      }
    } catch (err) {
      console.error('Fetch cart error:', err)
    }
  }

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

  // Filter products based on search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCartData({ items: [], totalPrice: 0, totalItems: 0 })
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    fetchCart()
  }

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Please sign in to add items to cart')
      setShowAuthModal(true)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        '/api/cart/add',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (res.data.success) {
        setCartData(res.data.cart)
        // Show brief success message
        const btn = event.target
        const originalText = btn.textContent
        btn.textContent = '✓ Added!'
        btn.style.background = '#4caf50'
        setTimeout(() => {
          btn.textContent = originalText
          btn.style.background = ''
        }, 1500)
      }
    } catch (err) {
      console.error('Add to cart error:', err)
      //alert('Failed to add item to cart')
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
        <div style={{...styles.header, background: 'linear-gradient(45deg, #161616 0%, #363535 100%)'}}>
          <div style={styles.headerContent}>
            <div style={styles.logoSection}>
              <img src="/assets/logo.png" alt="ElectroMart Logo" style={styles.logoImage} />
              <div>
                <h1>ElectroMart</h1>
                <p>Premium Electrical Equipment & Supplies</p>
              </div>
            </div>
            
            <div style={styles.authSection}>
              {user ? (
                <>
                  <button 
                    onClick={() => setShowCart(true)} 
                    style={styles.cartButton}
                  >
                    🛒 Cart ({cartData.totalItems})
                  </button>
                  <span style={styles.userGreeting}>👋 Hi, {user.name}!</span>
                  <button onClick={handleLogout} style={styles.logoutButton}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <button onClick={() => setShowAuthModal(true)} style={styles.signInButton}>
                  🔐 Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>

        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        {showCart && (
          <Cart 
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            cartData={cartData}
            onUpdateCart={setCartData}
          />
        )}

        <body>
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
            
            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                {searchTerm && (
                  <button 
                    style={styles.clearButton}
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchTerm && (
                <p style={styles.searchResults}>
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              )}
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
            ) : filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔍</div>
                <p>No products match "{searchTerm}"</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredProducts.map((p) => (
                  <div key={p._id} style={styles.productCard}>
                    {/* Stock Badge */}
                    <div style={{
                      ...styles.badge,
                      backgroundColor: p.inStock ? '#4caf50' : '#f44336'
                    }}>
                      {p.inStock ? '✓ In Stock' : 'Out of Stock'}
                    </div>

                    {/* Product Image */}
                    <div style={styles.productIcon}>
                      <img 
                        src={p.image || '⚡'} 
                        alt={p.name}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '15px'
                        }}
                        onError={(e) => e.target.textContent = '⚡'}
                      />
                    </div>

                    {/* Product Info */}
                    <h3 style={styles.productName}>{p.name}</h3>
                    <p style={styles.productDescription}>{p.description}</p>

                    {/* Price */}
                    <div style={styles.priceContainer}>
                      <span style={styles.price}>Rs.{p.price}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      style={styles.addButton}
                      onClick={() => handleAddToCart(p)}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      </body>
      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2025 ElectroMart. All rights reserved. | Designed by Pamuditha Sandaru Gunasena</p>
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
    justifyContent: 'space-between',
    gap: '20px',
  },

  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },

  cartButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #5e171d 0%, #363534 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 0, 0, 0.94)',
    whiteSpace: 'nowrap',
  },

  userGreeting: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
  },

  signInButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6d1823 0%, #1c1b1d 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(233, 60, 38, 0.4)',
    whiteSpace: 'nowrap',
  },

  logoutButton: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'none',
    whiteSpace: 'nowrap',
  },

  logo: {
    fontSize: '3rem',
    lineHeight: '1',
  },

  logoImage: {
    height: '60px',
    width: 'auto',
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
    color: '#a72626',
  },

  searchContainer: {
    marginBottom: '40px',
    animation: 'slideDown 0.5s ease',
  },

  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  searchIcon: {
    position: 'absolute',
    left: '20px',
    fontSize: '1.3rem',
    pointerEvents: 'none',
  },

  searchInput: {
    width: '100%',
    padding: '16px 50px 16px 55px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    outline: 'none',
    color: '#333',
    fontWeight: '500',
  },

  clearButton: {
    position: 'absolute',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#999',
    padding: '5px 10px',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchResults: {
    marginTop: '12px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease',
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
    background: 'linear-gradient(45deg, #161616 0%, #363535 100%)',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.9rem',
  },
}
