import React, { Component } from 'react'
import Layout from '../components/Layout'

import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

class Cart extends Component {
    static contextType = AppContext;

    render() {
        const { cart, removeFromCart, updateQty } = this.context;
        const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const itemCount = cart.reduce((s, i) => s + i.qty, 0);
        const savings = cart.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);

        return (
            <Layout>
                <div className="cartContainer">
                    <div className="row m-0 p-3 tbdr w-100 cartHeader">
                        <div className="col-9 p-3">

                            {cart.length === 0 && (
                                <div className="d-block emptyCartLoggedInUser bg-white p-4 mb-3">
                                    <h4 className="m-0">Your Amazon Cart is empty.</h4>
                                    <p className="mt-2">Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies, electronics and more.&nbsp;
                                        <Link to="/" className="text-decoration-none">Continue shopping on the Amazon homepage</Link>.
                                    </p>
                                    <Link to="/" className="btn btn-warning mt-2 px-4">Start Shopping</Link>
                                </div>
                            )}

                            {cart.length > 0 && (
                                <div className="d-block mb-3">
                                    <div className="bg-white">
                                        <div className="cartContainercol9 p-3">
                                            <h4 className="m-0">Shopping Cart</h4>
                                            <small className="text-muted float-end">Price</small>
                                            <div className="clearfix"></div>

                                            {cart.map(item => (
                                                <div key={item.id} className="row border-top border-bottom m-0 py-3">
                                                    <div className="col-2 p-2 d-flex align-items-start">
                                                        <div className="form-check me-2 mt-1">
                                                            <input className="form-check-input" type="checkbox" defaultChecked />
                                                        </div>
                                                        <Link to={`/detail?id=${item.id}`}>
                                                            <img
                                                                className="img-fluid"
                                                                src={item.image}
                                                                alt={item.name}
                                                                style={{ maxWidth: 100, maxHeight: 120, objectFit: 'contain' }}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="col-8 p-2">
                                                        <h6 className="m-0">
                                                            <Link to={`/detail?id=${item.id}`} className="text-decoration-none text-dark fw-semibold">
                                                                {item.name}
                                                            </Link>
                                                        </h6>
                                                        <div className="mt-1 mb-1">
                                                            <span className="badge bg-secondary me-1">{item.category}</span>
                                                            <span className="badge bg-light text-dark border">{item.type}</span>
                                                            {item.selectedColor ? <span className="badge bg-info text-dark border ms-1">Color: {item.selectedColor}</span> : null}
                                                        </div>
                                                        <span className="text-success small">In stock</span>
                                                        <ul className="nav mt-1 align-items-center">
                                                            <li className="nav-item">
                                                                <select
                                                                    className="form-select form-select-sm d-inline-block"
                                                                    style={{ width: 'auto' }}
                                                                    value={item.qty}
                                                                    onChange={e => updateQty(item.id, parseInt(e.target.value))}
                                                                >
                                                                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                                        <option key={n} value={n}>Qty: {n}</option>
                                                                    ))}
                                                                </select>
                                                            </li>
                                                            <li className="nav-item border-end">
                                                                <button
                                                                    className="nav-link btn btn-link btn-sm p-0 ps-2 pe-2 text-primary"
                                                                    onClick={() => removeFromCart(item.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </li>
                                                            <li className="nav-item border-end">
                                                                <Link className="nav-link btn-sm p-0 ps-2 pe-2" to="/wishlist">Save for later</Link>
                                                            </li>
                                                            <li className="nav-item">
                                                                <Link className="nav-link btn-sm p-0 ps-2 pe-2" to={`/detail?id=${item.id}`}>See more like this</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-2 p-2 text-end">
                                                        <span className="fw-bold">₹{(item.price * item.qty).toLocaleString()}</span>
                                                        <small className="d-block text-muted text-decoration-line-through">
                                                            ₹{(item.originalPrice * item.qty).toLocaleString()}
                                                        </small>
                                                        <small className="d-block text-success fw-bold">
                                                            {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="cartTotal text-end p-3">
                                                {savings > 0 && (
                                                    <div className="text-success mb-1 small">
                                                        Your savings: <span className="fw-bold">₹{savings.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <span className="fs-5">
                                                    Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):&nbsp;
                                                    <span className="fw-bold">₹{subtotal.toLocaleString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-3 p-3 tbdr">
                            <img className="img-fluid w-100" src="https://images-eu.ssl-images-amazon.com/images/G/31/checkout/assets/TM_desktop._CB443006202_.png" alt="secure" />
                            <div className="proccedtoboy p-3 bg-white mt-3 mb-3">
                                {cart.length > 0 ? (
                                    <>
                                        <h5>
                                            Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''}):&nbsp;
                                            <span className="text-danger">₹{subtotal.toLocaleString()}</span>
                                        </h5>
                                        {savings > 0 && (
                                            <p className="text-success small mb-1">You save ₹{savings.toLocaleString()} on this order</p>
                                        )}
                                        <div className="form-check mb-2">
                                            <input className="form-check-input" type="checkbox" id="giftCheck" />
                                            <label className="form-check-label" htmlFor="giftCheck">
                                                This order contains a gift
                                            </label>
                                        </div>
                                        <Link to="/checkout" className="mb-3 mt-1 btn btn-warning btn-sm w-100 fw-bold">
                                            Proceed to Buy
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-2">
                                        <p className="text-muted">Your cart is empty</p>
                                        <Link to="/" className="btn btn-warning btn-sm w-100">Start Shopping</Link>
                                    </div>
                                )}
                                <div className="accordion mt-2" id="emiAccordion">
                                    <div className="accordion-item border rounded-0">
                                        <h2 className="accordion-header" id="emiHead">
                                            <button className="accordion-button bg-white text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#emiBody" aria-expanded="false" aria-controls="emiBody">
                                                EMI Available
                                            </button>
                                        </h2>
                                        <div id="emiBody" className="accordion-collapse collapse" aria-labelledby="emiHead" data-bs-parent="#emiAccordion">
                                            <div className="accordion-body">
                                                <p>Your order qualifies for EMI with valid credit cards. Learn more</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="more_itm_to_exp bg-white border rounded-3 p-3">
                                <h6>More items to explore</h6>
                                <div className="row m-0">
                                    <div className="col-5 p-0">
                                        <img className="img-fluid w-100" src="https://images-eu.ssl-images-amazon.com/images/I/61UXezWyusL._AC_UL100_SR100,76_.jpg" alt="item" />
                                    </div>
                                    <div className="col-7 p-0 ps-2">
                                        <a href="#" className="small text-decoration-none">Vamsha Nature Care Products</a>
                                        <span className="text-danger d-block">₹198.00</span>
                                        <Link to="/" className="btn amznBtn btn-sm p-1 rounded-3 mt-1">Shop Now</Link>
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

Cart.propTypes = {};
export default Cart;