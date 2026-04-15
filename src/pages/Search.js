import React, { Component } from 'react'
import Layout from '../components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faTh, faChevronLeft, faChevronRight, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

class Search extends Component {
  static contextType = AppContext
  totalPreviewFrames = 36
  previewSpinTimer = null

  fallbackImage = '/images/main_imgs/1.jpg'
  mobileFallbackImage = '/images/main_imgs/mobile-placeholder.svg'
  productFallbackImage = '/images/main_imgs/4.jpg'

  queryAliases = {
    mobiles: 'mobile',
    moblies: 'mobile',
    moblie: 'mobile',
    laptops: 'laptop',
    headphones: 'headphone',
    acs: 'ac',
    conditioners: 'conditioner',
    televisions: 'television',
    tvs: 'tv'
  }

  synonymGroups = [
    ['mobile', 'smartphone', 'phone', 'cellphone', 'handset'],
    ['laptop', 'notebook'],
    ['headphone', 'headset', 'earphone'],
    ['tv', 'television']
  ]

  state = {
    rating: 'a_4_5star',
    query: '',
    selectedColors: {},
    imageFallbackIndex: {},
    preview360Item: null,
    preview360Frame: 0,
    preview360AutoSpin: false,
    preview360Dragging: false,
    preview360DragStartX: 0,
    preview360DragStartFrame: 0,
    preview360SelectedColor: 'Standard',
    view: {
      r: 100,
      col1: 3,
      col2: 9
    }
  }

  componentDidMount() {
    this.syncQueryFromLocation()
  }

  componentWillUnmount() {
    this.stopPreviewAutoSpin()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.syncQueryFromLocation()
    }
  }

  syncQueryFromLocation = () => {
    const params = new URLSearchParams(this.props.location.search)
    const query = (params.get('q') || '').trim()
    this.setState({ query })
  }

  showGridView = () => {
    this.setState({
      view: {
        r: '25 float-start',
        col1: 12,
        col2: 12
      }
    })
  }

  showListView = () => {
    this.setState({
      view: {
        r: 100,
        col1: 3,
        col2: 9
      }
    })
  }

  goBack = () => {
    if (this.props.history.length > 1) {
      this.props.history.goBack()
      return
    }
    this.props.history.push('/')
  }

  normalizeText = (value) => {
    return (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  normalizeToken = (token) => {
    if (!token) {
      return ''
    }

    const aliased = this.queryAliases[token] || token

    if (aliased.endsWith('ies') && aliased.length > 3) {
      return aliased.slice(0, -3) + 'y'
    }
    if (aliased.endsWith('es') && aliased.length > 2) {
      return aliased.slice(0, -2)
    }
    if (aliased.endsWith('s') && aliased.length > 1) {
      return aliased.slice(0, -1)
    }

    return aliased
  }

  getQueryTokens = () => {
    const rawTokens = this.normalizeText(this.state.query).split(' ').filter(Boolean)
    return rawTokens.map(this.normalizeToken)
  }

  getItemTokens = (item) => {
    const searchableText = this.normalizeText(
      `${item.name || ''} ${item.category || ''} ${item.type || ''} ${item.description || ''}`
    )

    return searchableText
      .split(' ')
      .filter(Boolean)
      .map(this.normalizeToken)
  }

  getEditDistance = (a, b) => {
    const rows = a.length + 1
    const cols = b.length + 1
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0))

    for (let i = 0; i < rows; i += 1) {
      dp[i][0] = i
    }
    for (let j = 0; j < cols; j += 1) {
      dp[0][j] = j
    }

    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        )
      }
    }

    return dp[a.length][b.length]
  }

  isSemanticMatch = (queryToken, itemToken) => {
    return this.synonymGroups.some((group) => {
      const normalizedGroup = group.map(this.normalizeToken)
      return normalizedGroup.includes(queryToken) && normalizedGroup.includes(itemToken)
    })
  }

  isTokenMatch = (queryToken, itemToken) => {
    if (!queryToken || !itemToken) {
      return false
    }

    if (this.isSemanticMatch(queryToken, itemToken)) {
      return true
    }

    if (itemToken.includes(queryToken) || queryToken.includes(itemToken)) {
      return true
    }

    if (Math.abs(queryToken.length - itemToken.length) > 2) {
      return false
    }

    const maxDistance = queryToken.length <= 4 ? 1 : 2
    return this.getEditDistance(queryToken, itemToken) <= maxDistance
  }

  getFilteredItems = () => {
    const products = this.context && this.context.products ? this.context.products : []
    const queryTokens = this.getQueryTokens()

    if (!queryTokens.length) {
      return products
    }

    if (queryTokens.some((t) => ['all', 'product', 'products', 'item', 'items'].includes(t))) {
      return products
    }

    const strictMatches = products.filter((item) => {
      const itemTokens = this.getItemTokens(item)
      return queryTokens.every((queryToken) =>
        itemTokens.some((itemToken) => this.isTokenMatch(queryToken, itemToken))
      )
    })

    if (strictMatches.length > 0) {
      return strictMatches
    }

    return products.filter((item) => {
      const searchText = this.normalizeText(`${item.name} ${item.category} ${item.type} ${item.description || ''}`)
      return queryTokens.some((token) => searchText.includes(token))
    })
  }

  getFallbackImageForItem = (item) => {
    const text = this.normalizeText(`${item.category || ''} ${item.type || ''} ${item.name || ''}`)
    if (text.includes('mobile') || text.includes('smartphone') || text.includes('phone')) {
      return this.mobileFallbackImage
    }
    return this.productFallbackImage
  }

  getColorOptions = (item) => {
    if (item.colors && item.colors.length) {
      return item.colors
    }

    const text = this.normalizeText(`${item.category || ''} ${item.type || ''} ${item.name || ''}`)
    if (text.includes('smartphone') || text.includes('mobile') || text.includes('phone')) {
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
    if (text.includes('fashion') || text.includes('shirt') || text.includes('dress') || text.includes('shoes')) {
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
    if (c.includes('gold')) return '#ca8a04'
    if (c.includes('yellow') || c.includes('amber')) return '#f59e0b'
    if (c.includes('orange') || c.includes('sunset')) return '#f97316'
    if (c.includes('violet') || c.includes('purple')) return '#7c3aed'
    if (c.includes('gunmetal')) return '#4b5563'
    if (c.includes('phantom')) return '#475569'
    if (c.includes('deluxe') || c.includes('travel')) return '#334155'
    if (c.includes('multi')) return 'linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #3b82f6)'
    if (c.includes('classic')) return '#64748b'
    return '#9ca3af'
  }

  getSelectedColor = (item) => {
    const options = this.getColorOptions(item)
    return this.state.selectedColors[item.id] || options[0]
  }

  handleColorChange = (itemId, color) => {
    this.setState((prev) => ({
      selectedColors: {
        ...prev.selectedColors,
        [itemId]: color
      }
    }))
  }

  getImageCandidatesForItem = (item) => {
    const fallbackForItem = this.getFallbackImageForItem(item)
    return [item.image, fallbackForItem].filter(Boolean)
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

  open360Preview = (item) => {
    this.stopPreviewAutoSpin()
    this.setState({
      preview360Item: item,
      preview360Frame: 0,
      preview360AutoSpin: false,
      preview360Dragging: false,
      preview360SelectedColor: this.getSelectedColor(item)
    })
  }

  close360Preview = () => {
    this.stopPreviewAutoSpin()
    this.setState({
      preview360Item: null,
      preview360Frame: 0,
      preview360AutoSpin: false,
      preview360Dragging: false,
      preview360SelectedColor: 'Standard'
    })
  }

  stopPreviewAutoSpin = () => {
    if (this.previewSpinTimer) {
      clearInterval(this.previewSpinTimer)
      this.previewSpinTimer = null
    }
  }

  togglePreviewAutoSpin = () => {
    this.setState((prev) => {
      const nextAutoSpin = !prev.preview360AutoSpin
      if (nextAutoSpin) {
        this.stopPreviewAutoSpin()
        this.previewSpinTimer = setInterval(() => {
          this.setState((innerPrev) => ({
            preview360Frame: (innerPrev.preview360Frame + 1) % this.totalPreviewFrames
          }))
        }, 90)
      } else {
        this.stopPreviewAutoSpin()
      }
      return { preview360AutoSpin: nextAutoSpin }
    })
  }

  stepPreviewFrame = (delta) => {
    this.setState((prev) => {
      const next = (prev.preview360Frame + delta + this.totalPreviewFrames) % this.totalPreviewFrames
      return { preview360Frame: next }
    })
  }

  handlePreviewDragStart = (e) => {
    this.stopPreviewAutoSpin()
    this.setState({
      preview360AutoSpin: false,
      preview360Dragging: true,
      preview360DragStartX: e.clientX,
      preview360DragStartFrame: this.state.preview360Frame
    })
  }

  handlePreviewDragMove = (e) => {
    if (!this.state.preview360Dragging) {
      return
    }
    const dx = e.clientX - this.state.preview360DragStartX
    const frameShift = Math.round(dx / 8)
    let next = (this.state.preview360DragStartFrame + frameShift) % this.totalPreviewFrames
    if (next < 0) {
      next += this.totalPreviewFrames
    }
    this.setState({ preview360Frame: next })
  }

  handlePreviewDragEnd = () => {
    if (this.state.preview360Dragging) {
      this.setState({ preview360Dragging: false })
    }
  }

  handlePreviewColorChange = (color) => {
    const item = this.state.preview360Item
    if (!item) {
      return
    }
    this.handleColorChange(item.id, color)
    this.setState({ preview360SelectedColor: color })
  }

  handleImageError = (itemId, totalCandidates) => {
    this.setState((prev) => {
      const current = prev.imageFallbackIndex[itemId] || 0
      const next = Math.min(current + 1, totalCandidates - 1)
      return {
        imageFallbackIndex: {
          ...prev.imageFallbackIndex,
          [itemId]: next
        }
      }
    })
  }

  getDiscountPercent = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) {
      return 0
    }
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  formatReviews = (reviews) => {
    if (!reviews && reviews !== 0) {
      return '0'
    }
    if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(1)}k`
    }
    return `${reviews}`
  }

  handleAddToCart = (item, redirectToCart = true) => {
    if (this.context && this.context.addToCart) {
      const itemWithColor = {
        ...item,
        selectedColor: this.getSelectedColor(item)
      }
      this.context.addToCart(itemWithColor, 1)
      if (redirectToCart) {
        this.props.history.push('/cart')
      }
    }
  }

  handleBuyNow = (item) => {
    if (this.context && this.context.addToCart) {
      const itemWithColor = {
        ...item,
        selectedColor: this.getSelectedColor(item)
      }
      this.context.addToCart(itemWithColor, 1)
      const isSignedIn = !!localStorage.getItem('token')
      this.props.history.push(isSignedIn ? '/checkout' : '/signin?next=/checkout')
    }
  }

  renderItem = (item) => {
    const imageCandidates = this.getImageCandidatesForItem(item)
    const currentImageIndex = this.state.imageFallbackIndex[item.id] || 0
    const displayImage = imageCandidates[Math.min(currentImageIndex, imageCandidates.length - 1)]
    const discount = this.getDiscountPercent(item.price, item.originalPrice)
    const ratingText = (item.rating || 0).toFixed(1)
    const boughtCount = item.reviews > 5000 ? '1K+' : '400+'
    const colorOptions = this.getColorOptions(item)
    const selectedColor = this.getSelectedColor(item)
    const imgFilter = this.getColorFilter(selectedColor)

    return (
      <div key={item.id} className={'row m-0 border-top border-bottom w-' + this.state.view.r + ' align-items-start'}>
        <div className={'p-3 col-' + this.state.view.col1}>
          <img
            className="img-fluid"
            src={displayImage}
            alt={item.name}
            style={{ cursor: 'pointer', filter: imgFilter, transition: 'filter 0.2s ease' }}
            onClick={() => this.props.history.push(`/detail?id=${item.id}&color=${encodeURIComponent(selectedColor)}`)}
            onError={() => this.handleImageError(item.id, imageCandidates.length)}
          />
          <div className="mt-1">
            <button className="btn btn-link btn-sm p-0" onClick={() => this.open360Preview(item)}>360 view</button>
          </div>
        </div>
        <div className={'p-3 col-' + this.state.view.col2}>
          <h4 className="text-dark mb-1">
            <Link to={`/detail?id=${item.id}&color=${encodeURIComponent(selectedColor)}`} className="text-decoration-none text-dark">
              {item.name}
            </Link>
          </h4>
          <p className="mb-1 text-muted">{item.category}{item.type ? ` | ${item.type}` : ''}</p>
          <p className="mb-1" style={{ color: '#0f6cbf', fontSize: '1rem' }}>
            {ratingText} <span style={{ color: '#f08804' }}>★★★★★</span> ({this.formatReviews(item.reviews)})
          </p>
          <p className="mb-1 text-muted" style={{ fontSize: '1.1rem' }}>{boughtCount} bought in past month</p>
          <p className="mb-1">
            <span className="fw-bold" style={{ fontSize: '2rem' }}>Rs. {item.price.toLocaleString('en-IN')}</span>
            {item.originalPrice ? (
              <>
                <span className="text-muted ms-2">M.R.P: </span>
                <span className="text-muted text-decoration-line-through">Rs. {item.originalPrice.toLocaleString('en-IN')}</span>
              </>
            ) : null}
            {discount > 0 ? <span className="ms-2 fw-bold">({discount}% off)</span> : null}
          </p>
          <p className="mb-2" style={{ fontSize: '1.1rem' }}>
            FREE delivery <strong>Tomorrow</strong>
          </p>
          <div className="mb-2 d-flex align-items-center flex-wrap">
            <label className="me-2 text-muted">Color:</label>
            {colorOptions.map((color) => {
              const isActive = selectedColor === color
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => this.handleColorChange(item.id, color)}
                  className="btn p-0 me-2 mb-1 rounded-circle"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: this.getSwatchStyle(color),
                    border: isActive ? '2px solid #111827' : '1px solid #cbd5e1'
                  }}
                ></button>
              )
            })}
            <small className="text-muted">{selectedColor}</small>
          </div>
          <button
            className="btn btn-warning rounded-pill px-4"
            onClick={() => this.handleAddToCart(item)}
          >
            Add to cart
          </button>
          <button
            className="btn btn-outline-dark rounded-pill px-4 ms-2"
            onClick={() => this.handleBuyNow(item)}
          >
            Buy now
          </button>
          <Link to={`/detail?id=${item.id}&color=${encodeURIComponent(selectedColor)}`} className="btn btn-link ms-2">
            View product
          </Link>
        </div>
      </div>
    )
  }

  render() {
    const items = this.getFilteredItems()
    const previewItem = this.state.preview360Item
    const previewCandidates = previewItem ? this.getImageCandidatesForItem(previewItem) : []
    const previewImage = previewCandidates.length ? previewCandidates[0] : ''
    const previewAngle = (360 / this.totalPreviewFrames) * this.state.preview360Frame
    const previewColors = previewItem ? this.getColorOptions(previewItem) : []
    const previewColor = this.state.preview360SelectedColor
    const previewColorFilter = this.getColorFilter(previewColor)

    return (
      <Layout>
        {previewItem && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 200000 }}>
            <div className="bg-white rounded shadow p-3 position-absolute top-50 start-50 translate-middle" style={{ width: 'min(92vw, 720px)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="m-0">360 View: {previewItem.name}</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={this.close360Preview}>Close</button>
              </div>
              <div
                className="text-center border rounded p-3"
                onMouseDown={this.handlePreviewDragStart}
                onMouseMove={this.handlePreviewDragMove}
                onMouseUp={this.handlePreviewDragEnd}
                onMouseLeave={this.handlePreviewDragEnd}
                style={{ cursor: this.state.preview360Dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
              >
                <img
                  src={previewImage}
                  alt={previewItem.name}
                  className="img-fluid"
                  style={{
                    maxHeight: 380,
                    transform: `perspective(900px) rotateY(${previewAngle}deg)`,
                    filter: previewColorFilter,
                    transition: this.state.preview360Dragging ? 'none' : 'transform 0.06s linear'
                  }}
                />
                <small className="text-muted d-block mt-2">Drag left/right for frame-by-frame 360 view</small>
              </div>
              <div className="row mt-3 align-items-center">
                <div className="col-sm-7 mb-2 mb-sm-0">
                  <div className="btn-group">
                    <button className="btn btn-outline-secondary" onClick={() => this.stepPreviewFrame(-1)}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className="btn btn-outline-secondary" onClick={this.togglePreviewAutoSpin}>
                      <FontAwesomeIcon icon={this.state.preview360AutoSpin ? faPause : faPlay} /> {this.state.preview360AutoSpin ? 'Pause' : 'Auto Spin'}
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => this.stepPreviewFrame(1)}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                  <small className="d-block text-muted mt-1">Frame {this.state.preview360Frame + 1} / {this.totalPreviewFrames}</small>
                </div>
                <div className="col-sm-5">
                  <label className="form-label mb-1">Color</label>
                  <select className="form-select form-select-sm" value={previewColor} onChange={(e) => this.handlePreviewColorChange(e.target.value)}>
                    {previewColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="a_srch_main tbdr">
          <div className="a_srch_top border-bottom">
            <p className="m-0 p-3">
              {items.length > 0
                ? `1-${items.length} of ${items.length} results${this.state.query ? ` for \"${this.state.query}\"` : ''}`
                : `0 results${this.state.query ? ` for \"${this.state.query}\"` : ''}`}
            </p>
          </div>
          <div className="row a_srch_mbox m-0 mt-3">
            <div className="col-12 col-md-3 border-end searchAside p-3">
              <span className="text-dark fw-bold">Search Tips</span>
              <ul className="list-group mt-2">
                <li className="list-group-item p-0 border-0">Try product name like "laptop"</li>
                <li className="list-group-item p-0 border-0">Try category like "mobile"</li>
                <li className="list-group-item p-0 border-0">Use shorter keywords for better matches</li>
              </ul>
            </div>
            <div className="col-12 col-md-9 p-4 border-start">
              <div>
                <button className="btn btn-outline-secondary btn-sm mb-2" onClick={this.goBack}>
                  Back
                </button>
                <button className="btn btn-sm float-end" onClick={this.showListView}>
                  <FontAwesomeIcon icon={faList} />
                </button>
                <button className="btn btn-sm float-end" onClick={this.showGridView}>
                  <FontAwesomeIcon icon={faTh} />
                </button>
              </div>

              <div className="a_srch_ProdResult pt-4 pb-4">
                {items.length > 0 ? (
                  items.map(this.renderItem)
                ) : (
                  <div className="p-4 border rounded bg-white">
                    <h5>No items found</h5>
                    <p className="mb-0">Try a different search term.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

Search.propTypes = {}
export default Search
