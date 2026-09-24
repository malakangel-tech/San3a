import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="bg-brand-bg pt-6 pb-4 px-6 md:px-16 flex justify-between items-center relative z-50">
      <Link to="/" className="text-3xl font-bold text-brand-dark tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
        San3a
      </Link>

      <div className="hidden md:flex gap-10 items-center text-sm tracking-wide text-brand-dark/80 font-medium">
        <Link to="/" className="hover:text-brand-gold transition-colors">{t('furniture')}</Link>
        <Link to="/custom" className="hover:text-brand-gold transition-colors">{t('custom')}</Link>
        <Link to="/vendors" className="hover:text-brand-gold transition-colors">{t('vendors')}</Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <button onClick={toggleLanguage} className="flex items-center text-sm text-brand-dark/80 hover:text-brand-gold transition-colors uppercase tracking-widest font-semibold">
          <Globe className="w-4 h-4 mx-1" /> {i18n.language === 'ar' ? 'EN' : 'AR'}
        </button>
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* تحويل الأزرار إلى روابط فعلية */}
          <Link to="/login" className="text-brand-dark/80 hover:text-brand-gold transition">{t('login')}</Link>
          <Link to="/register" className="border border-brand-gold text-brand-dark px-5 py-2 rounded-[4px] hover:bg-brand-gold hover:text-white transition-all duration-300">
            {t('register')}
          </Link>
        </div>
      </div>

      <button className="md:hidden text-brand-dark" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-brand-bg flex flex-col p-6 gap-6 md:hidden shadow-xl border-t border-brand-gold/20">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-brand-dark text-lg">{t('furniture')}</Link>
          <Link to="/custom" onClick={() => setIsOpen(false)} className="text-brand-dark text-lg">{t('custom')}</Link>
          <Link to="/vendors" onClick={() => setIsOpen(false)} className="text-brand-dark text-lg">{t('vendors')}</Link>
          <button onClick={toggleLanguage} className="text-right text-brand-gold font-bold">{i18n.language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</button>
          <div className="flex flex-col gap-3 mt-2 border-t border-gray-200 pt-4">
            <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="text-brand-dark font-medium w-full text-right">{t('login')}</button>
            <button onClick={() => { navigate('/register'); setIsOpen(false); }} className="bg-brand-gold text-white px-5 py-3 rounded-[4px] w-full font-medium">{t('register')}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
