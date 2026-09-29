import os

path = "src/pages/Login.jsx"

new_login_code = """import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // حفظ جلسة وهمية وسحب البيانات الحالية
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'user');
    }
    localStorage.setItem('userEmail', formData.email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] dark:bg-[#121212] py-12 px-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 space-y-6">

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-brand-dark dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('welcome_back')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('login_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1.5">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="mail@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-gray-700 dark:text-gray-200">{t('password')}</label>
              <a href="#" className="text-[11px] text-brand-gold hover:underline font-medium">
                {t('forgot_password')}
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-3.5 text-gray-400 hover:text-brand-gold"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl hover:bg-brand-gold dark:hover:bg-brand-gold/80 transition-colors uppercase tracking-wider text-xs shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <span>{t('sign_in')}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          <div className="text-center pt-4 border-t border-gray-100 dark:border-white/10">
            <span className="text-gray-500 dark:text-gray-400">{t('dont_have_account')} </span>
            <Link to="/register" className="text-brand-gold font-bold underline">{t('create_account')}</Link>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Login;
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(new_login_code)

print("✅ تم إصلاح تباين الألوان والوضع الليلي لصفحة تسجيل الدخول بنجاح!")
