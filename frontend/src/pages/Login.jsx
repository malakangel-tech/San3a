import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  
  // حالة التحكم بظهور كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-brand-bg">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80')" }}></div>
        <div className="absolute inset-0 bg-brand-dark/30 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 px-12 z-10">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>San3a</h2>
          <p className="text-gray-200 text-lg">{t('footer_desc')}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className={`text-3xl md:text-4xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>{t('welcome_back')}</h1>
            <p className="text-gray-500 mb-8">{t('login_desc')}</p>
          </motion.div>

          <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-semibold text-brand-dark mb-2">{t('email')}</label>
              <div className="relative">
                <Mail className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                <input type="email" required className={`w-full bg-white border border-gray-200 rounded-lg py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all`} placeholder="mail@example.com" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-brand-dark">{t('password')}</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-gold hover:text-brand-dark transition-colors">{t('forgot_password')}</Link>
              </div>
              <div className="relative">
                <Lock className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="w-full bg-white border border-gray-200 rounded-lg py-3 px-12 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className={`absolute top-3.5 ${isAr ? 'left-4' : 'right-4'} text-gray-400 hover:text-brand-gold transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors duration-300">
                {t('sign_in_btn')} {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </motion.div>
          </form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center text-sm text-gray-500">
            {t('no_account')} <Link to="/register" className="text-brand-gold font-bold hover:underline">{t('create_account')}</Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Login;
