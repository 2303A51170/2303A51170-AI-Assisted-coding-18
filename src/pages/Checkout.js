import React, { Component } from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal'
];

class Checkout extends Component {
  static contextType = AppContext;

  state = {
    step: 1,
    name: '',
    mobile: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    addrState: '',
    addressType: 'Home',
    paymentMethod: 'cod',
    upiMode: 'id',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
    upiScanDone: false,
    upiTxnRef: '',
    netBankingBank: '',
    errors: {},
  };

  validateAddress = () => {
    const { name, mobile, pincode, addressLine1, city, addrState } = this.state;
    const err = {};
    if (!name.trim()) err.name = 'Full name is required';
    if (!/^\d{10}$/.test(mobile)) err.mobile = 'Enter valid 10-digit mobile number';
    if (!addressLine1.trim()) err.addressLine1 = 'Address is required';
    if (!/^\d{6}$/.test(pincode)) err.pincode = 'Enter valid 6-digit pincode';
    if (!city.trim()) err.city = 'City is required';
    if (!addrState) err.addrState = 'State is required';
    this.setState({ errors: err });
    return Object.keys(err).length === 0;
  };

  validatePayment = () => {
    const { paymentMethod, cardNumber, cardName, cardExpiry, cardCvv, upiId, netBankingBank, upiMode, upiScanDone, upiTxnRef } = this.state;
    const err = {};
    if (paymentMethod === 'card') {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) err.cardNumber = 'Enter valid 16-digit card number';
      if (!cardName.trim()) err.cardName = 'Name on card is required';
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) err.cardExpiry = 'Enter expiry as MM/YY';
      if (!/^\d{3,4}$/.test(cardCvv)) err.cardCvv = 'Enter valid CVV (3-4 digits)';
    } else if (paymentMethod === 'upi') {
      if (upiMode === 'id') {
        if (!upiId.includes('@')) err.upiId = 'Enter valid UPI ID (e.g., name@bank)';
      } else {
        if (!upiScanDone) err.upiScanDone = 'Scan and confirm payment completion';
        if (!upiTxnRef.trim()) err.upiTxnRef = 'Enter UPI transaction reference';
      }
    } else if (paymentMethod === 'netbanking') {
      if (!netBankingBank) err.netBankingBank = 'Please select a bank';
    }
    this.setState({ errors: err });
    return Object.keys(err).length === 0;
  };

  goNext = () => {
    if (this.state.step === 1 && !this.validateAddress()) return;
    if (this.state.step === 2 && !this.validatePayment()) return;
    this.setState(s => ({ step: s.step + 1, errors: {} }));
  };

  goBack = () => this.setState(s => ({ step: s.step - 1, errors: {} }));

  formatCard = val => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  getUpiLink = () => {
    const { upiId } = this.state;
    const { cart } = this.context;
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const merchantUpi = '9494628724-2@ybl';
    return `upi://pay?${new URLSearchParams({
      pa: merchantUpi,
      pn: 'Amazon Clone',
      am: String(subtotal),
      cu: 'INR',
      tn: `Payment from ${upiId}`
    }).toString()}`;
  };

  normalizeIndianPhone = (value) => {
    const digits = (value || '').replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return '';
  };

  handleSendPaymentRequest = (channel) => {
    const { upiId, mobile } = this.state;
    const { cart } = this.context;
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const phone = this.normalizeIndianPhone(mobile);

    if (!upiId.includes('@')) {
      this.setState(s => ({
        errors: { ...s.errors, upiId: 'Enter valid UPI ID (e.g., name@bank)' }
      }));
      return;
    }

    if (!phone) {
      this.setState(s => ({
        errors: { ...s.errors, mobile: 'Enter valid customer mobile in delivery address (10 digits).' }
      }));
      return;
    }

    const upiLink = this.getUpiLink();
    const message = `Please complete payment of Rs. ${subtotal.toLocaleString('en-IN')} using this UPI link: ${upiLink}`;

    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (channel === 'sms') {
      window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
      return;
    }
  };

  handleCopyPaymentLink = async () => {
    const { upiId } = this.state;
    if (!upiId.includes('@')) {
      this.setState(s => ({
        errors: { ...s.errors, upiId: 'Enter valid UPI ID (e.g., name@bank)' }
      }));
      return;
    }

    const upiLink = this.getUpiLink();
    try {
      await navigator.clipboard.writeText(upiLink);
      alert('UPI payment link copied. Share it with customer on PhonePe/WhatsApp.');
    } catch {
      alert('Could not copy automatically. Please use Open Generic UPI Link and share it manually.');
    }
  };

  handlePayInPhone = () => {
    const { upiId } = this.state;

    if (!upiId.includes('@')) {
      this.setState(s => ({
        errors: { ...s.errors, upiId: 'Enter valid UPI ID (e.g., name@bank)' }
      }));
      return;
    }

    const genericUpiLink = this.getUpiLink();
    const upiParams = genericUpiLink.replace('upi://pay?', '');
    const phonePeAndroidIntent = `intent://pay?${upiParams}#Intent;scheme=upi;package=com.phonepe.app;end`;
    const isAndroid = /Android/i.test(window.navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(window.navigator.userAgent);

    if (isAndroid) {
      window.location.href = phonePeAndroidIntent;
      setTimeout(() => {
        window.location.href = genericUpiLink;
      }, 700);
      return;
    }

    if (isIOS) {
      window.location.href = genericUpiLink;
      return;
    }

    this.setState(s => ({
      errors: {
        ...s.errors,
        upiId: 'From laptop, use Send via WhatsApp/SMS to request payment on customer phone.'
      }
    }));
  };

  handlePlaceOrder = () => {
    const { name, mobile, pincode, addressLine1, addressLine2, city, addrState, addressType, paymentMethod, cardNumber, upiId, netBankingBank, upiMode, upiTxnRef } = this.state;
    const merchantUpi = '9494628724-2@ybl';
    const address = {
      name, mobile, pincode,
      address: addressLine1 + (addressLine2 ? ', ' + addressLine2 : ''),
      city, state: addrState, type: addressType
    };
    const paymentDisplay =
      paymentMethod === 'card' ? `Card ending in ${cardNumber.replace(/\s/g, '').slice(-4)}`
        : paymentMethod === 'upi'
          ? (upiMode === 'scan' ? `UPI Scan (Txn Ref: ${upiTxnRef})` : `UPI to ${merchantUpi} (Payer: ${upiId})`)
          : paymentMethod === 'netbanking' ? `Net Banking: ${netBankingBank}`
            : 'Cash on Delivery';
    const orderId = this.context.placeOrder(address, paymentDisplay);
    this.props.history.push('/order_confirmation/' + orderId);
  };

  renderField = (label, field, opts = {}) => {
    const { errors } = this.state;
    const { placeholder, maxLength, half } = opts;
    return (
      <div className={half ? 'col-6' : 'col-12'} key={field}>
        <label className="form-label fw-semibold">{label} *</label>
        <input
          type="text"
          className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
          value={this.state[field]}
          onChange={e => this.setState({ [field]: e.target.value })}
          placeholder={placeholder || ''}
          maxLength={maxLength}
        />
        {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
      </div>
    );
  };

  render() {
    const { cart } = this.context;
    const { step, errors } = this.state;
    const isSignedIn = !!localStorage.getItem('token');
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itemCount = cart.reduce((s, i) => s + i.qty, 0);
    const savings = cart.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);
    const upiAmount = subtotal.toLocaleString('en-IN');
    const merchantUpi = '9494628724-2@ybl';
    const upiIntentValue = `upi://pay?${new URLSearchParams({
      pa: merchantUpi,
      pn: 'Amazon Clone',
      am: String(subtotal),
      cu: 'INR',
      tn: this.state.upiId ? `Payment from ${this.state.upiId}` : 'Amazon Clone Order Payment'
    }).toString()}`;
    const upiQrValue = `upi://pay?${new URLSearchParams({
      pa: merchantUpi,
      pn: 'Amazon Clone',
      am: String(subtotal),
      cu: 'INR',
      tn: 'Amazon Clone Order Payment'
    }).toString()}`;

    if (!isSignedIn) {
      return (
        <Layout>
          <div className="container mt-5 mb-5">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: 700 }}>
              <div className="card-body p-4 text-center">
                <h4 className="mb-2">Sign in required to place order</h4>
                <p className="text-muted mb-4">Please sign in first. You can review products in your cart before payment.</p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/cart" className="btn btn-outline-secondary">← Back to Cart</Link>
                  <Link to="/signin?next=/checkout" className="btn btn-warning">Sign In to Continue</Link>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

    if (cart.length === 0) {
      return (
        <Layout>
          <div className="container text-center mt-5 py-5">
            <h3>Your cart is empty</h3>
            <p className="text-muted">Add some products before checking out</p>
            <Link to="/" className="btn btn-warning px-5 mt-2">Continue Shopping</Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="container mt-4 mb-5">
          <div className="mb-3">
            <Link to="/cart" className="btn btn-outline-secondary btn-sm">← Back to Cart</Link>
          </div>
          {/* Step breadcrumb */}
          <nav aria-label="checkout steps" className="mb-4">
            <ol className="breadcrumb fs-6">
              <li className={`breadcrumb-item ${step >= 1 ? 'fw-bold text-warning' : 'text-muted'}`}>
                {step > 1 ? '✓ ' : ''}1. Delivery Address
              </li>
              <li className={`breadcrumb-item ${step >= 2 ? 'fw-bold text-warning' : 'text-muted'}`}>
                {step > 2 ? '✓ ' : ''}2. Payment Method
              </li>
              <li className={`breadcrumb-item ${step >= 3 ? 'fw-bold text-warning' : 'text-muted'}`}>
                3. Review & Place Order
              </li>
            </ol>
          </nav>

          <div className="row g-4">
            {/* Main content */}
            <div className="col-md-8">

              {/* ===== STEP 1: ADDRESS ===== */}
              {step === 1 && (
                <div className="card shadow-sm">
                  <div className="card-header bg-warning text-dark fw-bold fs-5 py-3">
                    📦 Step 1 of 3 — Delivery Address
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      {this.renderField('Full Name', 'name', { placeholder: 'Enter your full name', half: true })}
                      {this.renderField('Mobile Number', 'mobile', { placeholder: '10-digit mobile number', maxLength: 10, half: true })}
                      {this.renderField('Address Line 1', 'addressLine1', { placeholder: 'House No., Building, Street, Area' })}
                      <div className="col-12">
                        <label className="form-label fw-semibold">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={this.state.addressLine2}
                          onChange={e => this.setState({ addressLine2: e.target.value })}
                          placeholder="Landmark, Colony (optional)"
                        />
                      </div>
                      {this.renderField('Pincode', 'pincode', { placeholder: '6-digit pincode', maxLength: 6, half: true })}
                      {this.renderField('City / District', 'city', { placeholder: 'City', half: true })}
                      <div className="col-12">
                        <label className="form-label fw-semibold">State *</label>
                        <select
                          className={`form-select ${errors.addrState ? 'is-invalid' : ''}`}
                          value={this.state.addrState}
                          onChange={e => this.setState({ addrState: e.target.value })}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.addrState && <div className="invalid-feedback">{errors.addrState}</div>}
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Address Type</label>
                        <div className="d-flex gap-4">
                          {['Home', 'Work', 'Other'].map(t => (
                            <div className="form-check" key={t}>
                              <input className="form-check-input" type="radio" name="addrType" value={t}
                                checked={this.state.addressType === t}
                                onChange={e => this.setState({ addressType: e.target.value })} />
                              <label className="form-check-label">{t}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-warning mt-4 px-5 fw-bold" onClick={this.goNext}>
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* ===== STEP 2: PAYMENT ===== */}
              {step === 2 && (
                <div className="card shadow-sm">
                  <div className="card-header bg-warning text-dark fw-bold fs-5 py-3">
                    💳 Step 2 of 3 — Payment Method
                  </div>
                  <div className="card-body p-4">
                    <div className="list-group mb-4">
                      {[
                        { value: 'cod',        icon: '💵', label: 'Cash on Delivery',          sub: 'Pay when your order arrives' },
                        { value: 'card',       icon: '💳', label: 'Credit / Debit Card',       sub: 'Visa, Mastercard, RuPay, AmEx' },
                        { value: 'upi',        icon: '📱', label: 'UPI',                       sub: 'Google Pay, PhonePe, BHIM, Paytm' },
                        { value: 'netbanking', icon: '🏦', label: 'Net Banking',               sub: 'All major Indian banks supported' },
                      ].map(pm => (
                        <label key={pm.value}
                          className={`list-group-item list-group-item-action ${this.state.paymentMethod === pm.value ? 'border-warning bg-warning bg-opacity-10' : ''}`}
                          style={{ cursor: 'pointer' }}>
                          <div className="d-flex align-items-center gap-3">
                            <input type="radio" name="pm" value={pm.value}
                              checked={this.state.paymentMethod === pm.value}
                              onChange={e => this.setState({ paymentMethod: e.target.value, errors: {} })} />
                            <span className="fs-4">{pm.icon}</span>
                            <div>
                              <div className="fw-semibold">{pm.label}</div>
                              <small className="text-muted">{pm.sub}</small>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Card form */}
                    {this.state.paymentMethod === 'card' && (
                      <div className="border rounded p-3 bg-light mb-3">
                        <h6 className="text-muted mb-3">Card Details</h6>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-semibold">Card Number *</label>
                            <input className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                              value={this.state.cardNumber} maxLength={19}
                              onChange={e => this.setState({ cardNumber: this.formatCard(e.target.value) })}
                              placeholder="1234 5678 9012 3456" />
                            {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold">Name on Card *</label>
                            <input className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                              value={this.state.cardName}
                              onChange={e => this.setState({ cardName: e.target.value })}
                              placeholder="Exactly as printed on card" />
                            {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                          </div>
                          <div className="col-6">
                            <label className="form-label fw-semibold">Expiry Date *</label>
                            <input className={`form-control ${errors.cardExpiry ? 'is-invalid' : ''}`}
                              value={this.state.cardExpiry}
                              onChange={e => this.setState({ cardExpiry: e.target.value })}
                              placeholder="MM/YY" maxLength={5} />
                            {errors.cardExpiry && <div className="invalid-feedback">{errors.cardExpiry}</div>}
                          </div>
                          <div className="col-6">
                            <label className="form-label fw-semibold">CVV *</label>
                            <input className={`form-control ${errors.cardCvv ? 'is-invalid' : ''}`}
                              value={this.state.cardCvv} type="password"
                              onChange={e => this.setState({ cardCvv: e.target.value })}
                              placeholder="3-4 digits" maxLength={4} />
                            {errors.cardCvv && <div className="invalid-feedback">{errors.cardCvv}</div>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI form */}
                    {this.state.paymentMethod === 'upi' && (
                      <div className="border rounded p-3 bg-light mb-3">
                        <div className="d-flex gap-4 mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="upiById"
                              checked={this.state.upiMode === 'id'}
                              onChange={() => this.setState({ upiMode: 'id', errors: {} })}
                            />
                            <label className="form-check-label" htmlFor="upiById">Pay by UPI ID</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="upiByScan"
                              checked={this.state.upiMode === 'scan'}
                              onChange={() => this.setState({ upiMode: 'scan', errors: {} })}
                            />
                            <label className="form-check-label" htmlFor="upiByScan">Scan QR</label>
                          </div>
                        </div>

                        {this.state.upiMode === 'id' && (
                          <>
                            <label className="form-label fw-semibold">UPI ID *</label>
                            <input className={`form-control ${errors.upiId ? 'is-invalid' : ''}`}
                              value={this.state.upiId}
                              onChange={e => this.setState({ upiId: e.target.value })}
                              placeholder="yourname@upi" />
                            {errors.upiId && <div className="invalid-feedback">{errors.upiId}</div>}
                            <small className="text-muted d-block mt-1">Example: mobilenumber@upi, name@okaxis, name@oksbi</small>
                            <div className="mt-3 p-3 border rounded bg-white">
                              <div className="fw-semibold">Paying to: {merchantUpi}</div>
                              <div className="text-muted">Amount: Rs. {upiAmount}</div>
                              <button
                                type="button"
                                className="btn btn-success btn-sm mt-2"
                                onClick={this.handlePayInPhone}
                              >
                                Pay in Phone
                              </button>
                              <a className="btn btn-outline-secondary btn-sm mt-2 ms-2" href={upiIntentValue}>Open Generic UPI Link</a>
                              <div className="mt-2 d-flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => this.handleSendPaymentRequest('whatsapp')}
                                >
                                  Send via WhatsApp
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => this.handleSendPaymentRequest('sms')}
                                >
                                  Send via SMS
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={this.handleCopyPaymentLink}
                                >
                                  Copy Payment Link
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                        {this.state.upiMode === 'scan' && (
                          <>
                            <div className="text-center border rounded bg-white p-3 mb-3">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiQrValue)}`}
                                alt="UPI QR code"
                                style={{ width: 220, height: 220 }}
                              />
                              <p className="mb-1 mt-2 fw-semibold">Scan with any UPI app</p>
                              <small className="text-muted d-block">UPI ID: {merchantUpi}</small>
                              <small className="text-muted d-block">Amount: Rs. {upiAmount}</small>
                              <a className="btn btn-success btn-sm mt-2" href={upiQrValue}>Pay using UPI app</a>
                            </div>

                            <label className="form-label fw-semibold">UPI Transaction Ref *</label>
                            <input
                              className={`form-control ${errors.upiTxnRef ? 'is-invalid' : ''}`}
                              value={this.state.upiTxnRef}
                              onChange={e => this.setState({ upiTxnRef: e.target.value })}
                              placeholder="Enter UPI transaction reference"
                            />
                            {errors.upiTxnRef && <div className="invalid-feedback">{errors.upiTxnRef}</div>}

                            <div className="form-check mt-2">
                              <input
                                className={`form-check-input ${errors.upiScanDone ? 'is-invalid' : ''}`}
                                type="checkbox"
                                id="upiScanDone"
                                checked={this.state.upiScanDone}
                                onChange={e => this.setState({
                                  upiScanDone: e.target.checked,
                                  upiTxnRef: e.target.checked && !this.state.upiTxnRef ? `UPI${Date.now()}` : this.state.upiTxnRef
                                })}
                              />
                              <label className="form-check-label" htmlFor="upiScanDone">
                                I have completed payment in my UPI app
                              </label>
                              {errors.upiScanDone && <div className="invalid-feedback d-block">{errors.upiScanDone}</div>}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Net Banking form */}
                    {this.state.paymentMethod === 'netbanking' && (
                      <div className="border rounded p-3 bg-light mb-3">
                        <label className="form-label fw-semibold">Select Bank *</label>
                        <select className={`form-select ${errors.netBankingBank ? 'is-invalid' : ''}`}
                          value={this.state.netBankingBank}
                          onChange={e => this.setState({ netBankingBank: e.target.value })}>
                          <option value="">— Select Your Bank —</option>
                          {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank',
                            'Punjab National Bank','Bank of Baroda','Canara Bank','Union Bank of India','IndusInd Bank']
                            .map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {errors.netBankingBank && <div className="invalid-feedback">{errors.netBankingBank}</div>}
                      </div>
                    )}

                    <div className="d-flex gap-3 mt-3">
                      <button className="btn btn-outline-secondary px-4" onClick={this.goBack}>← Back</button>
                      <button className="btn btn-warning px-5 fw-bold" onClick={this.goNext}>Review Order →</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== STEP 3: REVIEW ===== */}
              {step === 3 && (
                <div className="card shadow-sm">
                  <div className="card-header bg-warning text-dark fw-bold fs-5 py-3">
                    ✅ Step 3 of 3 — Review & Place Order
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <h6 className="fw-bold">📦 Delivery Address</h6>
                        <div className="border rounded p-3 bg-light h-100">
                          <p className="mb-1 fw-semibold">{this.state.name}</p>
                          <p className="mb-1">{this.state.addressLine1}{this.state.addressLine2 ? ', ' + this.state.addressLine2 : ''}</p>
                          <p className="mb-1">{this.state.city}, {this.state.addrState} – {this.state.pincode}</p>
                          <p className="mb-1">📞 {this.state.mobile}</p>
                          <span className="badge bg-secondary">{this.state.addressType}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <h6 className="fw-bold">💳 Payment Method</h6>
                        <div className="border rounded p-3 bg-light h-100">
                          <p className="mb-0 fw-semibold">
                            {this.state.paymentMethod === 'card'
                              ? `💳 Card ending in ${this.state.cardNumber.replace(/\s/g, '').slice(-4)}`
                              : this.state.paymentMethod === 'upi'
                                ? (this.state.upiMode === 'scan'
                                  ? `📱 UPI Scan (Txn Ref: ${this.state.upiTxnRef || 'Pending'})`
                                  : `📱 UPI: ${this.state.upiId}`)
                                : this.state.paymentMethod === 'netbanking'
                                  ? `🏦 ${this.state.netBankingBank}`
                                  : '💵 Cash on Delivery'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">🛒 Order Items ({cart.length} product{cart.length !== 1 ? 's' : ''})</h6>
                    {cart.map(item => (
                      <div key={item.id} className="d-flex align-items-center border rounded p-2 mb-2">
                        <img src={item.image} alt={item.name} style={{ width: 65, height: 65, objectFit: 'contain' }} className="me-3 border rounded p-1" />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-muted">{item.category} · {item.type} · Qty: {item.qty}{item.selectedColor ? ` · Color: ${item.selectedColor}` : ''}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-danger">₹{(item.price * item.qty).toLocaleString()}</div>
                          <small className="text-muted text-decoration-line-through">₹{(item.originalPrice * item.qty).toLocaleString()}</small>
                        </div>
                      </div>
                    ))}

                    <div className="text-end mt-3 border-top pt-3">
                      <div className="text-success mb-1">🚚 FREE Delivery on this order</div>
                      {savings > 0 && <div className="text-success mb-1">You save: <strong>₹{savings.toLocaleString()}</strong></div>}
                      <h5 className="fw-bold">Order Total: ₹{subtotal.toLocaleString()}</h5>
                      <small className="text-muted">Inclusive of all taxes</small>
                    </div>

                    <div className="d-flex gap-3 mt-4 align-items-center">
                      <button className="btn btn-outline-secondary px-4" onClick={this.goBack}>← Back</button>
                      <button className="btn btn-warning px-5 fw-bold fs-5" onClick={this.handlePlaceOrder}>
                        Place Order — ₹{subtotal.toLocaleString()}
                      </button>
                    </div>
                    <p className="text-muted mt-2 small">
                      By placing your order, you agree to Amazon's conditions of use and privacy notice.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-md-4">
              <div className="card shadow-sm sticky-top" style={{ top: 80 }}>
                <div className="card-header bg-light fw-bold py-3">Order Summary</div>
                <div className="card-body p-3">
                  {cart.map(item => (
                    <div key={item.id} className="d-flex align-items-center mb-2 pb-2 border-bottom">
                      <img src={item.image} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} className="me-2 border rounded p-1" />
                      <div className="flex-grow-1">
                        <small className="d-block fw-semibold">{item.name.length > 28 ? item.name.slice(0, 28) + '…' : item.name}</small>
                        <small className="text-muted">×{item.qty} · {item.category}{item.selectedColor ? ` · ${item.selectedColor}` : ''}</small>
                      </div>
                      <small className="fw-bold ms-2">₹{(item.price * item.qty).toLocaleString()}</small>
                    </div>
                  ))}
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between text-success mb-1">
                      <span>Delivery</span><span>FREE</span>
                    </div>
                    {savings > 0 && (
                      <div className="d-flex justify-content-between text-success mb-1">
                        <span>Total Savings</span>
                        <span>-₹{savings.toLocaleString()}</span>
                      </div>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

Checkout.propTypes = {};
export default Checkout;