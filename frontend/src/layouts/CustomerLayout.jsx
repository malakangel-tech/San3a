import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
