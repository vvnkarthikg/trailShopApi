import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/Pages/Products';
import Navbar from './components/Navbar';
import Auth from './components/Authentication/Auth';
import ProductDetails from './components/Pages/ProductDetails';
import UserOrders from './components/Pages/UserOrders';
import UserProfile from './components/Pages/UserProfile';
import AddProduct from './components/Pages/AddProduct';
import Footer from './components/Pages/Footer';
import ProductFetcher from './components/Pages/ProductFetcher';
import CartFetcher from './components/Pages/CartFetcher';
import Cart from './components/Pages/Cart';
import './App.css';


function App() {
  return (
      <div className="wrapper">
        <Router>
          <Navbar />
          <ProductFetcher />
          <CartFetcher />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
  );
}

export default App;
