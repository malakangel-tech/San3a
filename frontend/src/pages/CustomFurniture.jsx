import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Hammer, Sparkles, Upload, CheckCircle2, Calculator } from 'lucide-react';

const CustomFurniture = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [submitted, setSubmitted] = useState(false);
  
  const [furnitureType, setFurnitureType] = useState('sofa');
  const [woodType, setWoodType] = useState('beech');
  const [size, setSize] = useState('medium');

  const calculateEstimate = () => {
    let base = furnitureType === 'sofa' ? 600 : furnitureType === 'table' ? 450 : 300;
    let woodMultiplier = woodType === 'beech' ? 1.2 : woodType === 'oak' ? 1.5 : 1.0;
    let sizeMultiplier = size === 'small' ? 0.8 : size === 'medium' ? 1.0 : 1.3;
    return Math.round(base * woodMultiplier * sizeMultiplier);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4" /> {t('custom_tag')}
          </motion.div>
          <h1 className={`text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-4 ${isAr ? '' : 'font-serif'}`}>
            {t('custom_heading')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">
            {t('custom_desc')}
          </p>
        </div>

        {submitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#1E1E1E] p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-brand-dark dark:text-white">{t('custom_success_title')}</h3>
            <p className="text-gray-500 text-sm">{t('custom_success_desc')}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('furniture_type')}</label>
                <select 
                  value={furnitureType} 
                  onChange={(e) => setFurnitureType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold dark:text-white"
                >
                  <option value="sofa">{t('sofa_option')}</option>
                  <option value="table">{t('table_option')}</option>
                  <option value="chair">{t('chair_option')}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('wood_type')}</label>
                  <select 
                    value={woodType} 
                    onChange={(e) => setWoodType(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold dark:text-white"
                  >
                    <option value="beech">{t('beech_wood')}</option>
                    <option value="oak">{t('oak_wood')}</option>
                    <option value="mdf">{t('mdf_wood')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('approx_size')}</label>
                  <select 
                    value={size} 
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold dark:text-white"
                  >
                    <option value="small">{t('size_small')}</option>
                    <option value="medium">{t('size_medium')}</option>
                    <option value="large">{t('size_large')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('details_placeholder')}</label>
                <textarea rows="4" placeholder={t('details_placeholder')} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold resize-none dark:text-white"></textarea>
              </div>

              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-brand-gold transition-colors">
                <Upload className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('upload_label')}</p>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-4 rounded-xl hover:bg-brand-gold dark:hover:bg-brand-gold/80 transition-colors shadow-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                <Hammer className="w-5 h-5" /> {t('submit_custom')}
              </motion.button>
            </form>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-6 sticky top-24">
                <div className="flex items-center gap-2 text-brand-dark dark:text-white font-bold text-lg">
                  <Calculator className="w-5 h-5 text-brand-gold" /> {t('estimator_title')}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t('estimator_desc')}
                </p>

                <div className="bg-brand-gold/10 p-6 rounded-xl text-center space-y-1">
                  <span className="text-xs text-brand-gold font-bold uppercase tracking-wider">{t('estimated_cost_label')}</span>
                  <div className="text-4xl font-bold text-brand-dark dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${calculateEstimate()}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>{t('includes_labor')}</span>
                    <span className="font-bold text-green-600">{t('yes')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('delivery_time')}</span>
                    <span className="font-bold">{t('delivery_days')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CustomFurniture;
