import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-brand-bg">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=1200&q=80')" }}></div>
        <div className="absolute inset-0 bg-brand-dark/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 px-12 z-10">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>San3a</h2>
          <p className="text-gray-200 text-lg max-w-md">{t('hero_desc')}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative overflow-hidden">
        <div className="w-full max-w-md">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isAr ? -20 : 20 }} transition={{ duration: 0.3 }}>
                <h1 className={`text-3xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>{t('reset_title')}</h1>
                <p className="text-gray-500 mb-8">{t('reset_desc')}</p>
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">{t('email')}</label>
                    <div className="relative">
                      <Mail className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                      <input type="email" required className={`w-full bg-white border border-gray-200 rounded-lg py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-brand-gold focus:ring-1 transition-all`} placeholder="mail@example.com" />
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-gold text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-opacity-90 transition-all">
                    {t('send_code')} {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isAr ? -20 : 20 }} transition={{ duration: 0.3 }}>
                <h1 className={`text-3xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>{t('enter_code')}</h1>
                <p className="text-gray-500 mb-8">{t('code_desc')}</p>
                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5">
                  <div>
                    <div className="relative flex justify-center">
                      <KeyRound className={`absolute top-3.5 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                      <input type="text" maxLength="4" required className="w-full bg-white border border-gray-200 rounded-lg py-3 text-center text-2xl tracking-[1em] font-bold text-brand-dark outline-none focus:border-brand-gold focus:ring-1 transition-all" placeholder="••••" />
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-gold text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-opacity-90 transition-all">
                    {t('verify_code')} {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isAr ? -20 : 20 }} transition={{ duration: 0.3 }}>
                <h1 className={`text-3xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>{t('update_password')}</h1>
                <p className="text-gray-500 mb-8">{t('new_password')} لإنهاء العملية.</p>
                <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1">{t('new_password')}</label>
                    <div className="relative">
                      <Lock className={`absolute top-3.5 ${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <input type={showPassword ? "text" : "password"} required className="w-full bg-white border border-gray-200 rounded-lg py-3 px-10 text-sm outline-none focus:border-brand-gold transition-all" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-3.5 ${isAr ? 'left-3' : 'right-3'} text-gray-400 hover:text-brand-gold transition-colors`}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-1">{t('confirm_password')}</label>
                    <div className="relative">
                      <Lock className={`absolute top-3.5 ${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
                      <input type={showConfirmPassword ? "text" : "password"} required className="w-full bg-white border border-gray-200 rounded-lg py-3 px-10 text-sm outline-none focus:border-brand-gold transition-all" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-3.5 ${isAr ? 'left-3' : 'right-3'} text-gray-400 hover:text-brand-gold transition-colors`}>
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-dark text-white font-bold py-3.5 mt-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-brand-gold transition-colors duration-300">
                    {t('update_password')}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center text-sm">
            <Link to="/login" className="text-gray-500 font-medium hover:text-brand-gold transition-colors">{t('back_to_login')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
