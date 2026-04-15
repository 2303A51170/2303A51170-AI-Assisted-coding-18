import React, { Component } from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

class OrderHistroy extends Component {
    static contextType = AppContext;
    state = { search: '' }

    render() {
        const { orders } = this.context;
        const { search } = this.state;
        const filtered = orders.filter(o =>
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
        );

        return (
            <Layout>
                <div className="a_odr_his_main bg-white tbdr">
                    <div className="container ps-5 pe-5 pb-5">
                        <nav className="a_ordhis_breadcrumb mt-2" aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Your Account</Link></li>
                                <li className="breadcrumb-item active text-warning" aria-current="page">Your Orders</li>
                            </ol>
                        </nav>
                        <div className="row m-0 mb-3">
                            <div className="col p-0">
                                <h3>Your Orders</h3>
                            </div>
                            <div className="col p-0">
                                <div className="row g-2">
                                    <div className="col-sm-8 border rounded">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm border-0"
                                            placeholder="Search by product name or order ID"
                                            value={search}
                                            onChange={e => this.setState({ search: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-sm-4">
                                        <button className="btn btn-dark btn-sm w-100" onClick={() => {}}>Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 mb-3">
                            <strong>{filtered.length} order{filtered.length !== 1 ? 's' : ''}</strong> placed
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-5">
                                <p className="text-muted fs-5">No orders found.</p>
                                <Link to="/" className="btn btn-warning px-5">Start Shopping</Link>
                            </div>
                        )}

                        {filtered.map(order => (
                            <div key={order.id} className="card d-block mb-3 shadow-sm">
                                <div className="card-header bg-light">
                                    <div className="row m-0 align-items-center">
                                        <div className="col-2 p-0">
                                            <small className="d-block text-muted fw-bold">ORDER PLACED</small>
                                            <span>{order.date}</span>
                                        </div>
                                        <div className="col-2 p-0">
                                            <small className="d-block text-muted fw-bold">TOTAL</small>
                                            <span className="fw-bold text-danger">₹{order.total.toLocaleString()}</span>
                                        </div>
                                        <div className="col-2 p-0">
                                            <small className="d-block text-muted fw-bold">SHIP TO</small>
                                            <span>{order.address && order.address.name}</span>
                                        </div>
                                        <div className="col-2 p-0">
                                            <small className="d-block text-muted fw-bold">PAYMENT</small>
                                            <small>{order.paymentMethod}</small>
                                        </div>
                                        <div className="col-4 p-0 text-end">
                                            <small className="d-block text-muted">ORDER # {order.id}</small>
                                            <Link to={`/order_confirmation/${order.id}`} className="btn btn-sm btn-link p-0 me-2">View order details</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <span className="badge bg-warning text-dark fw-bold mb-2 px-3 py-2">{order.status}</span>
                                    <div className="mb-3">
                                        <small className="text-muted d-block">Expected Delivery: <strong>{order.expectedDelivery || 'TBD'}</strong></small>
                                        <small className="text-muted d-block">Tracking: Step {(order.trackingProgress || 1) + 1} of {(order.trackingSteps || []).length || 5}</small>
                                        <Link to={`/order_confirmation/${order.id}`} className="btn btn-outline-secondary btn-sm mt-2">
                                            Track package
                                        </Link>
                                    </div>
                                    {order.items.map(item => (
                                        <div key={item.id} className="row m-0 mt-2">
                                            <div className="col-1 p-0">
                                                <img
                                                    className="img-fluid"
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ maxWidth: 60, objectFit: 'contain' }}
                                                />
                                            </div>
                                            <div className="col-8 p-2">
                                                <Link to={`/detail?id=${item.id}`} className="text-decoration-none fw-semibold">{item.name}</Link>
                                                <div>
                                                    <small className="text-muted">{item.category} · {item.type} · Qty: {item.qty}</small>
                                                </div>
                                            </div>
                                            <div className="col-3 p-0 text-end">
                                                <div className="d-grid gap-1">
                                                    <Link to="/" className="btn amznBtn btn-sm border">Buy Again</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }
}

OrderHistroy.propTypes = {}
export default OrderHistroy