import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-brand-bg">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80')" }}></div>
        <div className="absolute inset-0 bg-brand-dark/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 px-12 z-10">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>San3a</h2>
          <p className="text-gray-200 text-lg max-w-md">{t('hero_desc')}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className={`text-3xl md:text-4xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>{t('join_us')}</h1>
            <p className="text-gray-500 mb-8">{t('register_desc')}</p>
          </motion.div>

          <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-semibold text-brand-dark mb-1">{t('full_name')}</label>
              <div className="relative">
                <User className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                <input type="text" required className={`w-full bg-white border border-gray-200 rounded-lg py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all`} placeholder="ملاك" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-semibold text-brand-dark mb-1">{t('email')}</label>
              <div className="relative">
                <Mail className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                <input type="email" required className={`w-full bg-white border border-gray-200 rounded-lg py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all`} placeholder="mail@example.com" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-semibold text-brand-dark mb-1">{t('password')}</label>
                <div className="relative">
                  <Lock className={`absolute top-3.5 ${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                  <input type={showPassword ? "text" : "password"} required className="w-full bg-white border border-gray-200 rounded-lg py-3 px-9 text-sm outline-none focus:border-brand-gold transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-3.5 ${isAr ? 'left-3' : 'right-3'} text-gray-400 hover:text-brand-gold transition-colors`}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-sm font-semibold text-brand-dark mb-1">{t('confirm_password')}</label>
                <div className="relative">
                  <Lock className={`absolute top-3.5 ${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                  <input type={showConfirmPassword ? "text" : "password"} required className="w-full bg-white border border-gray-200 rounded-lg py-3 px-9 text-sm outline-none focus:border-brand-gold transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-3.5 ${isAr ? 'left-3' : 'right-3'} text-gray-400 hover:text-brand-gold transition-colors`}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-gold text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all duration-300">
                {t('create_account_btn')} {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </motion.div>
          </form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 text-center text-sm text-gray-500">
            {t('already_have_account')} <Link to="/login" className="text-brand-dark font-bold hover:underline hover:text-brand-gold">{t('sign_in_now')}</Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Register;
