import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ShoppingBag, Moon, Sun, Bell, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setCartOpen, totalItems } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { notificationsOpen, setNotificationsOpen, unreadCount } = useNotifications();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className={`pt-6 pb-4 px-6 md:px-16 flex justify-between items-center relative z-40 transition-colors duration-300 ${darkMode ? 'bg-[#181818] text-white border-b border-white/10' : 'bg-brand-bg text-brand-dark'}`}>
      
      <Link to="/" className="text-3xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
        San3a
      </Link>

      <div className="hidden md:flex gap-8 items-center text-sm tracking-wide font-medium">
        <Link to="/" className="hover:text-brand-gold transition-colors">{t('furniture')}</Link>
        <Link to="/custom" className="hover:text-brand-gold transition-colors">{t('custom')}</Link>
        <Link to="/vendors" className="hover:text-brand-gold transition-colors">{t('vendors')}</Link>
        <Link to="/map" className="hover:text-brand-gold transition-colors flex items-center gap-1 text-brand-gold font-bold">
          <MapPin className="w-4 h-4" /> {t('map')}
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-5">
        <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative hover:text-brand-gold transition-colors p-2" title="الإشعارات">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button onClick={toggleTheme} className="p-2 text-brand-gold hover:scale-110 transition-transform" title="الوضع الليلي">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button onClick={() => setCartOpen(true)} className="relative hover:text-brand-gold transition-colors p-2" title="عربة التسوق">
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        <button onClick={toggleLanguage} className="flex items-center text-sm hover:text-brand-gold transition-colors uppercase tracking-widest font-semibold">
          <Globe className="w-4 h-4 mx-1" /> {i18n.language === 'ar' ? 'EN' : 'AR'}
        </button>

        <div className="flex items-center gap-3 text-sm font-medium border-s ps-5 border-gray-300 dark:border-white/20">
          <Link to="/login" className="hover:text-brand-gold transition">{t('login')}</Link>
          <Link to="/register" className="border border-brand-gold px-4 py-2 rounded-[4px] hover:bg-brand-gold hover:text-white transition-all duration-300">
            {t('register')}
          </Link>
        </div>
      </div>

      {/* أزرار الموبايل */}
      <div className="flex items-center gap-2 md:hidden">
        <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button onClick={toggleTheme} className="p-2 text-brand-gold">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button onClick={() => setCartOpen(true)} className="relative p-2">
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className={`absolute top-[80px] left-0 w-full flex flex-col p-6 gap-6 md:hidden shadow-xl border-t z-50 ${darkMode ? 'bg-[#181818] border-white/10' : 'bg-brand-bg border-brand-gold/20'}`}>
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg">{t('furniture')}</Link>
          <Link to="/custom" onClick={() => setIsOpen(false)} className="text-lg">{t('custom')}</Link>
          <Link to="/vendors" onClick={() => setIsOpen(false)} className="text-lg">{t('vendors')}</Link>
          <Link to="/map" onClick={() => setIsOpen(false)} className="text-lg text-brand-gold font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5" /> {t('map')}
          </Link>
          <button onClick={toggleLanguage} className="text-right text-brand-gold font-bold">{i18n.language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</button>
          <div className="flex flex-col gap-3 mt-2 border-t border-gray-200 dark:border-white/10 pt-4">
            <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="font-medium w-full text-right">{t('login')}</button>
            <button onClick={() => { navigate('/register'); setIsOpen(false); }} className="bg-brand-gold text-white px-5 py-3 rounded-[4px] w-full font-medium text-center">{t('register')}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
