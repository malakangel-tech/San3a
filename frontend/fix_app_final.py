import os

app_path = os.path.expanduser("~/San3a/frontend/src/App.jsx")

clean_app_code = """import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import VendorProfile from './pages/VendorProfile';
import CustomOrder from './pages/CustomOrder';
import MapPage from './pages/Map';
import Login from './pages/Login';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendor/:id" element={<VendorProfile />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
"""

with open(app_path, "w", encoding="utf-8") as f:
    f.write(clean_app_code)

print("✅ تم تنظيم ملف الراوتر App.jsx بنجاح تام!")
