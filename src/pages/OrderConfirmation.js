import React, { Component } from 'react'
import Layout from '../components/Layout'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

class OrderConfirmation extends Component {
    static contextType = AppContext;

    render() {
        const { orders } = this.context;
        const orderId = this.props.match.params.orderId;
        const order = orders.find(o => o.id === orderId);
        const trackingSteps = order && order.trackingSteps ? order.trackingSteps : [];

        if (!order) {
            return (
                <Layout>
                    <div className="container text-center mt-5 py-5">
                        <h3>Order not found</h3>
                        <p className="text-muted">We could not find your order. It may have already been processed.</p>
                        <Link to="/order_history" className="btn btn-warning me-3">View Order History</Link>
                        <Link to="/" className="btn btn-outline-secondary">Go to Home</Link>
                    </div>
                </Layout>
            );
        }

        return (
            <Layout>
                <div className="container mt-4 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="mb-3">
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => this.props.history.goBack()}>
                                    ← Back
                                </button>
                            </div>

                            <div className="card border-success shadow-sm mb-4">
                                <div className="card-body text-center p-5">
                                    <div className="display-4 text-success mb-3">✅</div>
                                    <h3 className="fw-bold text-success">Order Placed Successfully!</h3>
                                    <p className="text-muted mb-3">
                                        Thank you for shopping with Amazon. Your order has been confirmed.
                                    </p>
                                    <div className="alert alert-warning d-inline-block px-5">
                                        <strong>Order ID:</strong> {order.id}
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm mb-3">
                                <div className="card-header bg-light fw-bold py-3">Order Details</div>
                                <div className="card-body p-4">
                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <small className="text-muted d-block">ORDER DATE</small>
                                            <span className="fw-semibold">{order.date}</span>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">STATUS</small>
                                            <span className="badge bg-warning text-dark fs-6 px-3 py-2">{order.status}</span>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">PAYMENT</small>
                                            <span className="fw-semibold">{order.paymentMethod}</span>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">DELIVERY</small>
                                            <span className="text-success fw-semibold">FREE - Expected by {order.expectedDelivery || '3-5 business days'}</span>
                                        </div>
                                    </div>

                                    <div className="border-top pt-3 mb-3">
                                        <h6 className="fw-bold mb-3">Track Package</h6>
                                        {trackingSteps.length > 0 ? (
                                            <div>
                                                {trackingSteps.map((step, idx) => (
                                                    <div key={step.key} className="d-flex align-items-start mb-2">
                                                        <div className="me-2" style={{ minWidth: 24 }}>
                                                            <span className={`badge ${step.completed ? 'bg-success' : 'bg-secondary'}`}>{step.completed ? '✓' : idx + 1}</span>
                                                        </div>
                                                        <div>
                                                            <div className={`fw-semibold ${step.completed ? 'text-success' : 'text-muted'}`}>{step.label}</div>
                                                            <small className="text-muted">{step.time}</small>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">Tracking updates will appear shortly.</p>
                                        )}
                                    </div>

                                    <div className="border-top pt-3 mb-3">
                                        <h6 className="fw-bold mb-2">Delivery Address</h6>
                                        <p className="mb-0 fw-semibold">{order.address.name}</p>
                                        <p className="mb-0">{order.address.address}</p>
                                        <p className="mb-0">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                        <p className="mb-0">Mobile: {order.address.mobile}</p>
                                        <span className="badge bg-secondary mt-1">{order.address.type}</span>
                                    </div>

                                    <div className="border-top pt-3">
                                        <h6 className="fw-bold mb-3">Items Ordered ({order.items.length})</h6>
                                        {order.items.map(item => (
                                            <div key={item.id} className="d-flex align-items-center border rounded p-2 mb-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: 65, height: 65, objectFit: 'contain' }}
                                                    className="me-3 border rounded p-1"
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold">{item.name}</div>
                                                    <small className="text-muted">{item.category} - {item.type} - Qty: {item.qty}</small>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold">Rs.{(item.price * item.qty).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="text-end mt-3 border-top pt-2">
                                            <div className="text-success mb-1">Delivery: FREE</div>
                                            <h5 className="fw-bold">Order Total: Rs.{order.total.toLocaleString()}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <Link to="/" className="btn btn-warning flex-grow-1 fw-bold py-2">
                                    Continue Shopping
                                </Link>
                                <Link to="/order_history" className="btn btn-outline-secondary flex-grow-1 py-2">
                                    View All Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default OrderConfirmation;
