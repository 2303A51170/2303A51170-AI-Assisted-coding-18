import React, { Component } from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

class Detail extends Component {
  static contextType = AppContext

  state = {
    selectedQty: 1,
    selectedColor: 'Standard',
    addedToCart: false
  }

  componentDidMount() {
    this.syncFromQuery()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.syncFromQuery()
    }
  }

  getProduct = () => {
    const params = new URLSearchParams(this.props.location.search)
    const id = parseInt(params.get('id'), 10)
    const products = this.context && this.context.products ? this.context.products : []
    return products.find((p) => p.id === id) || null
  }

  getColorOptions = (product) => {
    if (!product) {
      return ['Standard']
    }

    if (product.colors && product.colors.length) {
      return product.colors
    }

    const text = `${product.category || ''} ${product.type || ''} ${product.name || ''}`.toLowerCase()
    if (text.includes('phone') || text.includes('smartphone') || text.includes('mobile')) {
      return ['Black', 'Blue', 'Silver', 'Green']
    }
    if (text.includes('laptop') || text.includes('notebook') || text.includes('computer')) {
      return ['Arctic Grey', 'Silver', 'Black', 'Blue']
    }
    if (text.includes('tv') || text.includes('smart led') || text.includes('television') || text.includes('led')) {
      return ['Black', 'Silver', 'Space Gray']
    }
    if (text.includes('air conditioner') || text.includes('ac') || text.includes('appliance')) {
      return ['White', 'Silver', 'Grey']
    }
    if (text.includes('shirt') || text.includes('dress') || text.includes('fashion') || text.includes('shoes')) {
      return ['Black', 'White', 'Blue', 'Red']
    }
    if (text.includes('kitchen') || text.includes('mixer') || text.includes('flask') || text.includes('fryer')) {
      return ['Steel', 'Black', 'White', 'Red']
    }
    if (text.includes('book')) {
      return ['Paperback', 'Hardcover', 'Kindle']
    }
    if (text.includes('sports') || text.includes('yoga') || text.includes('racket')) {
      return ['Green', 'Blue', 'Black', 'Orange']
    }
    if (text.includes('toy') || text.includes('lego') || text.includes('board game')) {
      return ['Classic', 'Multi-color', 'Red', 'Blue']
    }
    return ['Standard', 'Black', 'White']
  }

  syncFromQuery = () => {
    const product = this.getProduct()
    const params = new URLSearchParams(this.props.location.search)
    const colorFromQuery = params.get('color')
    const options = this.getColorOptions(product)
    const selectedColor = colorFromQuery && options.includes(colorFromQuery) ? colorFromQuery : options[0]
    this.setState({ selectedColor })
  }

  getSwatchStyle = (color) => {
    const c = (color || '').toLowerCase()
    if (c.includes('black')) return '#1f2937'
    if (c.includes('blue')) return '#2563eb'
    if (c.includes('green')) return '#16a34a'
    if (c.includes('pink')) return '#ec4899'
    if (c.includes('red')) return '#dc2626'
    if (c.includes('maroon') || c.includes('wine')) return '#7f1d1d'
    if (c.includes('silver')) return '#94a3b8'
    if (c.includes('white')) return '#f8fafc'
    if (c.includes('steel')) return '#9ca3af'
    if (c.includes('gray') || c.includes('grey')) return '#6b7280'
    if (c.includes('arctic')) return '#94a3b8'
    if (c.includes('space')) return '#374151'
    if (c.includes('navy') || c.includes('obsidian')) return '#1e3a8a'
    if (c.includes('olive')) return '#4d7c0f'
    if (c.includes('mint')) return '#34d399'
    if (c.includes('hazel')) return '#a16207'
    if (c.includes('copper')) return '#b45309'
    if (c.includes('gunmetal')) return '#4b5563'
    if (c.includes('phantom')) return '#475569'
    if (c.includes('deluxe') || c.includes('travel')) return '#334155'
    if (c.includes('violet') || c.includes('purple')) return '#7c3aed'
    if (c.includes('orange') || c.includes('sunset')) return '#f97316'
    if (c.includes('yellow') || c.includes('gold')) return '#f59e0b'
    if (c.includes('multi')) return 'linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #3b82f6)'
    if (c.includes('classic')) return '#64748b'
    return '#9ca3af'
  }

  getColorFilter = (color) => {
    const c = (color || '').toLowerCase()
    if (c.includes('black')) return 'brightness(0.75)'
    if (c.includes('blue')) return 'hue-rotate(180deg) saturate(1.2)'
    if (c.includes('green')) return 'hue-rotate(95deg) saturate(1.2)'
    if (c.includes('red')) return 'hue-rotate(330deg) saturate(1.2)'
    if (c.includes('silver')) return 'grayscale(0.35) brightness(1.1)'
    if (c.includes('white')) return 'grayscale(0.8) brightness(1.25)'
    return 'none'
  }

  handleAddToCart = (product) => {
    if (!product) {
      return
    }

    const payload = {
      ...product,
      selectedColor: this.state.selectedColor
    }

    this.context.addToCart(payload, this.state.selectedQty)
    this.setState({ addedToCart: true })
    setTimeout(() => this.setState({ addedToCart: false }), 1300)
  }

  handleBuyNow = (product) => {
    if (!product) {
      return
    }

    const payload = {
      ...product,
      selectedColor: this.state.selectedColor
    }

    this.context.addToCart(payload, this.state.selectedQty)
    const isSignedIn = !!localStorage.getItem('token')
    this.props.history.push(isSignedIn ? '/checkout' : '/signin?next=/checkout')
  }

  render() {
    const product = this.getProduct()

    if (!product) {
      return (
        <Layout>
          <div className="container py-5 text-center">
            <h3>Product not found</h3>
            <p className="text-muted">The selected product is unavailable.</p>
            <Link to="/search" className="btn btn-warning">Back to Search</Link>
          </div>
        </Layout>
      )
    }

    const colors = this.getColorOptions(product)
    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

    return (
      <Layout>
        <div className="container py-4">
          <div className="mb-3">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => this.props.history.goBack()}>Back</button>
          </div>

          <div className="row g-4 bg-white p-3 rounded shadow-sm">
            <div className="col-md-5 text-center">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid"
                style={{ maxHeight: 460, objectFit: 'contain', filter: this.getColorFilter(this.state.selectedColor), transition: 'filter 0.2s ease' }}
              />
            </div>

            <div className="col-md-7">
              <h2 className="mb-2">{product.name}</h2>
              <p className="text-muted mb-2">{product.category} | {product.type}</p>
              <p className="mb-2">{(product.rating || 0).toFixed(1)} ★★★★☆ ({product.reviews || 0})</p>

              <div className="mb-3">
                <span className="fw-bold" style={{ fontSize: 36 }}>Rs. {product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice ? (
                  <>
                    <span className="ms-2 text-muted">M.R.P:</span>
                    <span className="ms-1 text-muted text-decoration-line-through">Rs. {product.originalPrice.toLocaleString('en-IN')}</span>
                  </>
                ) : null}
                {discount > 0 ? <span className="ms-2 fw-bold">({discount}% off)</span> : null}
              </div>

              <p className="text-muted">{product.description}</p>

              <div className="mb-3">
                <label className="form-label fw-semibold d-block">Color: {this.state.selectedColor}</label>
                {colors.map((color) => {
                  const isActive = this.state.selectedColor === color
                  return (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      onClick={() => this.setState({ selectedColor: color })}
                      className="btn p-0 me-2 mb-2 rounded-circle"
                      style={{
                        width: 22,
                        height: 22,
                        backgroundColor: this.getSwatchStyle(color),
                        border: isActive ? '2px solid #111827' : '1px solid #cbd5e1'
                      }}
                    ></button>
                  )
                })}
              </div>

              <div className="mb-3" style={{ maxWidth: 120 }}>
                <label className="form-label">Quantity</label>
                <select
                  className="form-select"
                  value={this.state.selectedQty}
                  onChange={(e) => this.setState({ selectedQty: parseInt(e.target.value, 10) })}
                >
                  {[1, 2, 3, 4, 5].map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-warning px-4" onClick={() => this.handleAddToCart(product)}>Add to cart</button>
                <button className="btn btn-outline-dark px-4" onClick={() => this.handleBuyNow(product)}>Buy now</button>
              </div>

              {this.state.addedToCart && <div className="alert alert-success mt-3 py-2">Added to cart</div>}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Detail
