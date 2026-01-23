import React, { useState } from 'react'
import axios from 'axios'

export default function AuthModal({ onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin'
      const payload = isSignUp 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password }

      const res = await axios.post(endpoint, payload)
      
      if (res.data.success) {
        // Save token and user data
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        onSuccess(res.data.user)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>✕</button>
        
        <h2 style={styles.title}>
          {isSignUp ? '🛍️ Create Account' : '👋 Welcome Back'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? '⏳ Please wait...' : (isSignUp ? '🎉 Create Account' : '🔐 Sign In')}
          </button>
        </form>

        <div style={styles.switchContainer}>
          <p style={styles.switchText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              style={styles.switchButton}
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setFormData({ name: '', email: '', password: '' })
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },

  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '450px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.3s ease',
  },

  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#999',
    padding: '5px 10px',
    transition: 'color 0.2s ease',
    boxShadow: 'none',
  },

  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
  },

  input: {
    padding: '14px 18px',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9f9f9',
  },

  errorBox: {
    padding: '12px 16px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    fontSize: '0.9rem',
    border: '1px solid #ef9a9a',
  },

  submitButton: {
    padding: '16px 24px',
    fontSize: '1.1rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6e121f 0%, #343235 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
    marginTop: '10px',
  },

  switchContainer: {
    marginTop: '25px',
    textAlign: 'center',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '20px',
  },

  switchText: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0,
  },

  switchButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginLeft: '8px',
    padding: '4px 8px',
    transition: 'color 0.2s ease',
    textDecoration: 'underline',
    boxShadow: 'none',
  },
}
