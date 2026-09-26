import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* هيدر تواصل معنا */}
      <section className="bg-brand-dark text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-brand-dark to-brand-dark"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isAr ? '' : 'font-serif'}`}>{t('contact_title')}</h1>
          <p className="text-gray-300 text-lg md:text-xl font-light">{t('contact_subtitle')}</p>
        </motion.div>
      </section>

      {/* نموذج المراسلة ومعلومات الاتصال */}
      <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* معلومات الاتصال */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className={`text-2xl font-bold text-brand-dark ${isAr ? '' : 'font-serif'}`}>معلومات التواصل</h3>
            
            <div className="flex items-center gap-4 text-gray-600">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold"><MapPin className="w-5 h-5"/></div>
              <div>
                <h4 className="text-xs text-gray-400 uppercase font-semibold">الموقع</h4>
                <p className="text-sm font-bold text-brand-dark">البصرة، العراق</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold"><Phone className="w-5 h-5"/></div>
              <div>
                <h4 className="text-xs text-gray-400 uppercase font-semibold">الهاتف</h4>
                <p className="text-sm font-bold text-brand-dark">07757305530</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold"><Mail className="w-5 h-5"/></div>
              <div>
                <h4 className="text-xs text-gray-400 uppercase font-semibold">البريد الإلكتروني</h4>
                <p className="text-sm font-bold text-brand-dark">malak2006malak28@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* نموذج الإرسال */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <h3 className="text-xl font-bold text-brand-dark">{t('message_sent')}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className={`text-2xl font-bold text-brand-dark mb-6 ${isAr ? '' : 'font-serif'}`}>أرسل رسالة</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('your_name')}</label>
                <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('email')}</label>
                <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('your_message')}</label>
                <textarea rows="4" required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold resize-none"></textarea>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-lg hover:bg-brand-gold transition-colors shadow-lg flex items-center justify-center gap-2">
                {t('send_message')} <Send className="w-4 h-4" />
              </motion.button>
            </form>
          )}
        </div>

      </section>
    </div>
  );
};

export default Contact;
