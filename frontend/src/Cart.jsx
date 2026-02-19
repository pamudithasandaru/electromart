import React from 'react'
import axios from 'axios'

export default function Cart({ isOpen, onClose, cartData, onUpdateCart }) {
  const [loading, setLoading] = React.useState(false)

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(
        `/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (res.data.success) {
        onUpdateCart(res.data.cart)
      }
    } catch (err) {
      console.error('Update quantity error:', err)
      alert('Failed to update quantity')
    }
  }

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.data.success) {
        onUpdateCart(res.data.cart)
      }
    } catch (err) {
      console.error('Remove item error:', err)
      alert('Failed to remove item')
    }
  }

  const handleCheckout = async () => {
    if (cartData.items.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/cart/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.data.success) {
        alert(`🎉 ${res.data.message}\n\nTotal: Rs.${res.data.orderSummary.totalAmount.toFixed(2)}\nItems: ${res.data.orderSummary.itemCount}`)
        onUpdateCart({ items: [], totalPrice: 0, totalItems: 0 })
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Failed to process payment')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.cartPanel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>🛒 Shopping Cart</h2>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div style={styles.content}>
          {cartData.items.length === 0 ? (
            <div style={styles.emptyCart}>
              <div style={styles.emptyIcon}>🛍️</div>
              <p style={styles.emptyText}>Empty</p>
              <p style={styles.emptySubtext}>Add some products to get started!</p>
            </div>
          ) : (
            <>
              <div style={styles.itemsList}>
                {cartData.items.map((item) => (
                  <div key={item._id} style={styles.cartItem}>
                    <img 
                      src={item.image || '⚡'} 
                      alt={item.name}
                      style={styles.itemImage}
                      onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Ctext x="50%25" y="50%25" font-size="40" text-anchor="middle" dy=".3em"%3E⚡%3C/text%3E%3C/svg%3E'}
                    />
                    
                    <div style={styles.itemDetails}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <p style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</p>
                    </div>

                    <div style={styles.quantityControl}>
                      <button 
                        style={styles.qtyButton}
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span style={styles.quantity}>{item.quantity}</span>
                      <button 
                        style={styles.qtyButton}
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div style={styles.itemTotal}>
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button 
                      style={styles.removeButton}
                      onClick={() => removeItem(item._id)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Total Items:</span>
                  <span style={styles.summaryValue}>{cartData.totalItems}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.totalLabel}>Total Amount:</span>
                  <span style={styles.totalValue}>Rs.{cartData.totalPrice.toFixed(2)}</span>
                </div>

                <button 
                  style={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? '⏳ Processing...' : '💳 Pay Now'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },

  cartPanel: {
    background: 'white',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-5px 0 20px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.3s ease',
  },

  header: {
    padding: '25px',
    borderBottom: '2px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #570e1a 0%, #39373a 100%)',
  },

  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '8px',
    transition: 'background 0.2s ease',
    boxShadow: 'none',
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  emptyCart: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },

  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '20px',
  },

  emptyText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },

  emptySubtext: {
    fontSize: '1rem',
    color: '#666',
  },

  itemsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },

  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    marginBottom: '15px',
    background: '#f9f9f9',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
  },

  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },

  itemPrice: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
  },

  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'white',
    padding: '5px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
  },

  qtyButton: {
    background: '#ad2121',
    color: 'white',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
    boxShadow: 'none',
    padding: 0,
  },

  quantity: {
    fontSize: '1rem',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
    color: '#333',
  },

  itemTotal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#660b17',
    minWidth: '80px',
    textAlign: 'right',
  },

  removeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.3rem',
    cursor: 'pointer',
    padding: '5px',
    transition: 'transform 0.2s ease',
    boxShadow: 'none',
  },

  summary: {
    padding: '25px',
    borderTop: '2px solid #f0f0f0',
    background: '#f9f9f9',
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },

  summaryLabel: {
    fontSize: '1rem',
    color: '#666',
  },

  summaryValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
  },

  totalLabel: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#333',
  },

  totalValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#5f0d1f',
  },

  checkoutButton: {
    width: '100%',
    padding: '18px',
    marginTop: '20px',
    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
  },
}
