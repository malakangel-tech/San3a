import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 20 }}>
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h1 className={`text-3xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>{t('order_success')}</h1>
        <p className="text-gray-500">جاري توجيهك إلى لوحة التحكم الخاصة بك...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className={`text-3xl font-bold text-brand-dark mb-8 ${isAr ? '' : 'font-serif'}`}>{t('checkout_title')}</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* تفاصيل التوصيل والدفع */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* عنوان الشحن */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-gold" /> {t('shipping_address')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{t('city')}</label>
                  <input type="text" required defaultValue="البصرة" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{t('phone')}</label>
                  <input type="tel" required defaultValue="07757305530" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">العنوان التفصيلي (المنطقة، الشارع، الدار)</label>
                <input type="text" required placeholder="حي المعقل، شارع الأربعين..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold" />
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-gold" /> {t('payment_method')}
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-gold bg-gray-50">
                  <input type="radio" name="payment" defaultChecked className="accent-brand-gold" />
                  <span className="text-sm font-semibold text-brand-dark">{t('cod')}</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-brand-gold bg-gray-50">
                  <input type="radio" name="payment" className="accent-brand-gold" />
                  <span className="text-sm font-semibold text-brand-dark">{t('online_payment')}</span>
                </label>
              </div>
            </div>

          </div>

          {/* ملخص الطلب الجانبي */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 sticky top-24">
              <h2 className="text-lg font-bold text-brand-dark">{t('order_summary')}</h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{item.title} (x{item.quantity})</span>
                    <span className="font-bold text-brand-dark">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span className="text-green-600 font-bold">مجاني</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-dark pt-2 border-t border-gray-100">
                  <span>المجموع الكلي:</span>
                  <span className="text-brand-gold" style={{ fontFamily: "'Playfair Display', serif" }}>${totalPrice}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-gold transition-colors shadow-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> {t('place_order')}
              </motion.button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
