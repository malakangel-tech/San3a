import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Hammer, Sparkles, Upload, CheckCircle2, Calculator, X } from 'lucide-react';
import { apiFetch } from '../services/api';

const CustomFurniture = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [furnitureType, setFurnitureType] = useState('sofa');
  const [woodType, setWoodType] = useState('beech');
  const [size, setSize] = useState('medium');
  const [details, setDetails] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must not exceed 10 MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG and WEBP images are allowed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const data = await apiFetch('/ai/analyze-image', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });

      setImageAnalysis(data);
      setUploadedImage(URL.createObjectURL(file));

      // Auto-fill form based on AI analysis
      if (data.furniture_type) {
        setFurnitureType(data.furniture_type.toLowerCase());
      }
      if (data.wood_type) {
        setWoodType(data.wood_type.toLowerCase());
      }
    } catch (err) {
      console.error('IMAGE ANALYSIS ERROR:', err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageAnalysis(null);
  };

  const calculateEstimate = () => {
    let base = furnitureType === 'sofa' ? 600 : furnitureType === 'table' ? 450 : 300;
    let woodMultiplier = woodType === 'beech' ? 1.2 : woodType === 'oak' ? 1.5 : 1.0;
    let sizeMultiplier = size === 'small' ? 0.8 : size === 'medium' ? 1.0 : 1.3;
    return Math.round(base * woodMultiplier * sizeMultiplier);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, get AI recommendations
      const aiData = await apiFetch('/ai/custom-design', {
        method: 'POST',
        body: JSON.stringify({
          furniture_type: furnitureType,
          dimensions: size,
          wood_type: woodType,
          additional_requirements: details
        }),
      });

      setAiRecommendations(aiData);

      // Then create the custom order
      const orderData = await apiFetch('/custom-orders', {
        method: 'POST',
        body: JSON.stringify({
          furniture_type: furnitureType,
          wood_type: woodType,
          size: size,
          details: details,
          estimated_price: calculateEstimate(),
          ai_recommendations: aiData
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('CUSTOM FURNITURE ERROR:', err);
      setError(err.message || 'Failed to create custom furniture request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
          </motion.div>
          <h1 className={`text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-4 ${isAr ? '' : 'font-serif'}`}>
            {t('custom_heading')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400 max-w-xl mx-auto text-sm">
            {t('custom_desc')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl text-center text-red-600 dark:text-red-400 text-xs mb-6">
            {error}
          </div>
        )}

        {submitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#1E1E1E] p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-brand-dark dark:text-white">{t('custom_success_title')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('custom_success_desc')}</p>
            {aiRecommendations && (
              <div className="mt-6 p-4 bg-brand-gold/10 rounded-xl text-left">
                <h4 className="font-bold text-brand-dark dark:text-white mb-2">{isAr ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}</h4>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-40">{JSON.stringify(aiRecommendations, null, 2)}</pre>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('furniture_type')}</label>
                <select 
                  value={furnitureType} 
                  onChange={(e) => setFurnitureType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold dark:text-white"
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
                    className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold dark:text-white"
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
                    className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold dark:text-white"
                  >
                    <option value="small">{t('size_small')}</option>
                    <option value="medium">{t('size_medium')}</option>
                    <option value="large">{t('size_large')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('details_placeholder')}</label>
                <textarea rows="4" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={t('details_placeholder')} className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-brand-gold resize-none dark:text-white"></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{isAr ? 'صورة مرجعية (اختياري)' : 'Reference Image (Optional)'}</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-brand-gold transition-colors relative">
                  {uploadedImage ? (
                    <div className="relative">
                      <img src={uploadedImage} alt="Uploaded" className="max-h-40 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {imageAnalysis && (
                        <div className="mt-2 p-2 bg-brand-gold/10 rounded-lg text-left">
                          <p className="text-xs font-bold text-brand-dark dark:text-white">{isAr ? 'تحليل الصورة' : 'Image Analysis'}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{imageAnalysis.description || isAr ? 'تم تحليل الصورة بنجاح' : 'Image analyzed successfully'}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                      <Upload className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('upload_label')}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'JPEG, PNG, WEBP (حد أقصى 10MB)' : 'JPEG, PNG, WEBP (max 10MB)'}</p>
                    </>
                  )}
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-4 rounded-xl hover:bg-brand-gold dark:hover:bg-brand-gold/80 transition-colors shadow-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Hammer className="w-5 h-5" /> {loading ? (isAr ? 'جاري المعالجة...' : 'Processing...') : t('submit_custom')}
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
