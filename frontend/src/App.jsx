import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/Home';
import CustomFurniture from './pages/CustomFurniture';
import Vendors from './pages/Vendors';
import VendorProfile from './pages/VendorProfile';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/custom" element={<CustomerLayout><CustomFurniture /></CustomerLayout>} />
        <Route path="/vendors" element={<CustomerLayout><Vendors /></CustomerLayout>} />
        <Route path="/vendor/:id" element={<CustomerLayout><VendorProfile /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
        <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
        <Route path="/forgot-password" element={<CustomerLayout><ForgotPassword /></CustomerLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
