import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // حفظ الدور والبيانات في الـ LocalStorage ليتم اعتمادها في لوحة التحكم
    localStorage.setItem('userRole', formData.role);
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', formData.fullName);
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] dark:bg-[#121212] py-12 px-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-brand-dark dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('join_us')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('register_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('full_name')}</label>
            <div className="relative">
              <User className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                required
                placeholder={t('name_placeholder')}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" 
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                required
                placeholder="mail@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" 
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('account_type')}</label>
            <div className="relative">
              <ShieldAlert className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white appearance-none cursor-pointer"
              >
                <option value="user">{t('role_user')}</option>
                <option value="craftsman">{t('role_craftsman')}</option>
                <option value="company">{t('role_company')}</option>
                <option value="admin">{t('role_admin')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" 
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('confirm_password')}</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" 
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
            className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl hover:bg-brand-gold dark:hover:bg-brand-gold/80 transition-colors uppercase tracking-wider text-xs shadow-md mt-2"
          >
            {t('create_account_btn')}
          </button>

          <div className="text-center pt-4 border-t border-gray-100 dark:border-white/10">
            <span className="text-gray-500">{t('already_have_account')} </span>
            <Link to="/login" className="text-brand-gold font-bold underline">{t('sign_in_now')}</Link>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Register;
