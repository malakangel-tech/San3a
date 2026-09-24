import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UploadCloud, MessageSquare, Hammer, Truck, Send } from 'lucide-react';

const CustomFurniture = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const steps = [
    { icon: <UploadCloud className="w-8 h-8 text-brand-gold" />, title: t('step1_title'), desc: t('step1_desc') },
    { icon: <MessageSquare className="w-8 h-8 text-brand-gold" />, title: t('step2_title'), desc: t('step2_desc') },
    { icon: <Hammer className="w-8 h-8 text-brand-gold" />, title: t('step3_title'), desc: t('step3_desc') },
    { icon: <Truck className="w-8 h-8 text-brand-gold" />, title: t('step4_title'), desc: t('step4_desc') },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      
      {/* 1. Page Header */}
      <section className="bg-brand-dark text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-brand-dark to-brand-dark"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isAr ? '' : 'font-serif'}`}>{t('custom_hero_title')}</h1>
          <p className="text-gray-300 text-lg md:text-xl font-light">{t('custom_hero_desc')}</p>
        </motion.div>
      </section>

      {/* 2. How it works (الخطوات) */}
      <section className="py-20 px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold text-brand-dark ${isAr ? '' : 'font-serif'}`}>{t('how_it_works')}</h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-2 border-transparent group-hover:border-brand-gold transition-colors duration-300">
                {step.icon}
              </div>
              <h3 className={`text-xl font-bold text-brand-dark mb-3 ${isAr ? '' : 'font-serif'}`}>{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Luxury Request Form (نموذج الطلب) */}
      <section className="py-16 px-6 md:px-16 bg-white border-t border-gray-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto bg-brand-bg rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-gold/20"
        >
          <h2 className={`text-2xl md:text-3xl font-bold text-brand-dark mb-8 text-center ${isAr ? '' : 'font-serif'}`}>{t('request_form_title')}</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-dark">{t('form_name')}</label>
                <input type="text" className="bg-white px-4 py-3 rounded-md border border-gray-200 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" placeholder="مثال: طاولة طعام دائرية" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-dark">{t('form_dimensions')}</label>
                <input type="text" className="bg-white px-4 py-3 rounded-md border border-gray-200 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" placeholder="120cm x 80cm x 75cm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-brand-dark">{t('form_material')}</label>
              <select className="bg-white px-4 py-3 rounded-md border border-gray-200 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all">
                <option>{t('form_wood')}</option>
                <option>{t('form_fabric')}</option>
                <option>{t('form_metal')}</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-brand-dark">{t('form_details')}</label>
              <textarea rows="4" className="bg-white px-4 py-3 rounded-md border border-gray-200 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all resize-none" placeholder="اكتب أي تفاصيل، ألوان، أو متطلبات خاصة هنا..."></textarea>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-brand-dark">{t('form_upload')}</label>
              <div className="border-2 border-dashed border-gray-300 bg-white hover:bg-brand-gold/5 hover:border-brand-gold transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer text-gray-500">
                <UploadCloud className="w-10 h-10 mb-3 text-brand-gold" />
                <p className="text-sm font-medium">اسحب وأفلت الصور هنا أو اضغط للاستعراض</p>
                <p className="text-xs mt-1">PNG, JPG, PDF (Max 5MB)</p>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-gold text-white font-bold py-4 rounded-md mt-4 shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 text-lg uppercase tracking-wide"
            >
              {t('submit_request')} <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </motion.button>
          </form>
        </motion.div>
      </section>
      
    </div>
  );
};

export default CustomFurniture;
