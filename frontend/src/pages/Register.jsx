import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Eye, EyeOff, ShieldAlert, ImageIcon, FileText, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    profileImage: '',
    bio: ''
  });
  console.log("REGISTER DATA:", formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // تفريغ الأخطاء السابقة

    // 1. فحص تطابق كلمة المرور
    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ كلمة المرور وتأكيدها غير متطابقين!');
      return;
    }

    // 2. فحص قوة كلمة المرور (8 أحرف، تحتوي على أرقام وحروف)
    if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      setError('⚠️ يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حروف وأرقام.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      if (!data.token) {
        throw new Error('Registration failed: token not received');
      }

      // حفظ JWT
      localStorage.setItem('token', data.token);

      // قراءة بيانات المستخدم من JWT
      const payload = JSON.parse(
        atob(data.token.split('.')[1])
      );

      localStorage.setItem('userRole', payload.role || 'user');
      localStorage.setItem('userEmail', payload.email || '');
      localStorage.setItem('userId', payload.id || '');
      localStorage.setItem('userName', formData.name);
      if (formData.profileImage) localStorage.setItem('userImage', formData.profileImage);
      if (formData.bio) localStorage.setItem('userBio', formData.bio);

      // توجيه المستخدم للوحة التحكم بعد نجاح التسجيل
      navigate('/dashboard');
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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

        {/* عرض رسائل الخطأ إن وجدت */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('full_name')}</label>
            <div className="relative">
              <User className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input type="text" required placeholder={t('name_placeholder')} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input type="email" required placeholder="mail@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('account_type')}</label>
            <div className="relative">
              <ShieldAlert className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white appearance-none cursor-pointer">
                <option value="user">{t('role_user')}</option>
                <option value="craftsman">{t('role_craftsman')}</option>
                <option value="company">{t('role_company')}</option>
                <option value="admin">{t('role_admin')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">رابط الصورة الشخصية (اختياري)</label>
            <div className="relative">
              <ImageIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input type="url" placeholder="https://example.com/image.jpg" value={formData.profileImage} onChange={(e) => setFormData({...formData, profileImage: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" />
            </div>
          </div>

          {/* يظهر حقل النبذة فقط للنجارين والشركات */}
          {(formData.role === 'craftsman' || formData.role === 'company') && (
            <div>
              <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">نبذة عنك / عن الورشة</label>
              <div className="relative">
                <FileText className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <textarea placeholder="اكتب وصفاً مختصراً عن خبرتك أو ما تقدمه ورشتك..." value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="2" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white resize-none"></textarea>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{t('confirm_password')}</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-10 outline-none focus:border-brand-gold dark:text-white" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3.5 top-3.5 text-gray-400 hover:text-brand-gold">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl hover:bg-brand-gold dark:hover:bg-brand-gold/80 transition-colors uppercase tracking-wider text-xs shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating account...' : t('create_account_btn')}
          </button>

          <div className="text-center pt-4 border-t border-gray-100 dark:border-white/10">
            <span className="text-gray-500 dark:text-gray-400">{t('already_have_account')} </span>
            <Link to="/login" className="text-brand-gold font-bold underline">{t('sign_in_now')}</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Register;
