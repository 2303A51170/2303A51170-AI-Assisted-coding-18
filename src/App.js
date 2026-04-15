import './App.css';
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import AppProvider from './context/AppContext';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Delivery from './pages/Delivery';
import OrderHistroy from './pages/OrderHistroy';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Multilingual from './pages/Multilingual';
import OrderConfirmation from './pages/OrderConfirmation';

class App extends Component {
  render() {
    return (
      <AppProvider>
        <Router>
          <Route path="/" exact component={Home} />
          <Route path="/detail" component={Detail} />
          <Route path="/signin" component={SignIn} />
          <Route path="/register" component={Register} />
          <Route path="/search" component={Search} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/account" component={Account} />
          <Route path="/delivery" component={Delivery} />
          <Route path="/order_history" component={OrderHistroy} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/multilingualtest" component={Multilingual} />
          <Route path="/order_confirmation/:orderId" component={OrderConfirmation} />
        </Router>
      </AppProvider>
    );
  }
}


App.propTypes = {}
export default App
