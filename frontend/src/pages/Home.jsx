import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Sparkles, Scale, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../services/api';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [comparedProducts, setComparedProducts] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


useEffect(() => {
  const fetchProducts = async () => {
    try {
      const dummyProducts = [
        {
          id: 1,
          title: isAr ? 'طاولة طعام خشبية فاخرة' : 'Luxury Wooden Dining Table',
          price: 850,
          rating: 5,
          image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&q=80',
          isCustomizable: true
        },
        {
          id: 2,
          title: isAr ? 'كنبة مخملية مودرن' : 'Modern Velvet Sofa',
          price: 1200,
          rating: 5,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
          isCustomizable: true
        },
        {
          id: 3,
          title: isAr ? 'كرسي استرخاء جلد طبيعي' : 'Leather Lounge Chair',
          price: 450,
          rating: 4,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
          isCustomizable: false
        },
        {
          id: 4,
          title: isAr ? 'خزانة كتب خشبية بتصميم عصري' : 'Modern Wooden Bookshelf',
          price: 620,
          rating: 5,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80',
          isCustomizable: true
        }
      ];
      setProducts(dummyProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [i18n.language]);

  const handleCompareToggle = (product) => {
    setComparedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 2) {
        alert(isAr ? 'يمكنك مقارنة منتجين كحد أقصى في نفس الوقت' : 'You can compare up to 2 products at once');
        return prev;
      }
      return [...prev, product];
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* قسم الهيرو مع صورة الخلفية الفاخرة */}
      <section className="relative py-32 px-6 md:px-16 flex flex-col items-center text-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80')` }}>
        {/* طبقة تظليل فخمة لضمان وضوح النصوص */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-brand-gold text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-md">
             {t('hero_tag')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`text-4xl md:text-6xl font-bold text-white leading-tight mb-6 ${isAr ? '' : 'font-serif'}`} dangerouslySetInnerHTML={{ __html: t('hero_title') }} />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-gray-200 text-base md:text-lg max-w-xl mb-10 font-light">{t('hero_desc')}</motion.p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/custom" className="bg-brand-gold text-white font-bold px-8 py-4 rounded-md shadow-2xl hover:bg-brand-gold/90 transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              {t('btn_custom')} {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

      {/* قسم التشكيلة الرائجة */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-brand-gold text-xs font-bold uppercase tracking-widest block mb-2">المميزة</span>
            <h2 className={`text-3xl font-bold text-brand-dark dark:text-white ${isAr ? '' : 'font-serif'}`}>{t('marketplace')}</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onCompare={handleCompareToggle}
                isCompared={comparedProducts.some(p => p.id === product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* شريط المقارنة العائم */}
      <AnimatePresence>
        {comparedProducts.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-6 border border-brand-gold/30"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-wider">المقارنة ({comparedProducts.length}/2)</span>
            </div>
            <div className="flex gap-2">
              {comparedProducts.map(p => (
                <span key={p.id} className="bg-white dark:bg-[#1E1E1E]/10 px-3 py-1 rounded-lg text-xs">{p.title}</span>
              ))}
            </div>
            <button 
              onClick={() => setShowComparisonModal(true)}
              disabled={comparedProducts.length < 2}
              className={`bg-brand-gold text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-opacity ${comparedProducts.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold/80'}`}
            >
              قارن الآن
            </button>
            <button onClick={() => setComparedProducts([])} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة جدول المقارنة */}
      <AnimatePresence>
        {showComparisonModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#1E1E1E] w-full max-w-3xl rounded-2xl p-8 relative shadow-2xl border border-gray-100 dark:border-white/10">
              <button onClick={() => setShowComparisonModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark dark:text-white dark:hover:text-white"><X className="w-6 h-6"/></button>
              
              <h3 className={`text-2xl font-bold text-brand-dark dark:text-white mb-6 ${isAr ? '' : 'font-serif'}`}>جدول مقارنة المنتجات</h3>

              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-white/10 pt-6">
                <div className="text-xs font-bold text-gray-400 uppercase">المواصفات</div>
                {comparedProducts.map(p => (
                  <div key={p.id} className="text-center">
                    <img src={p.image} alt={p.title} className="w-24 h-24 object-contain mx-auto mb-2 mix-blend-multiply dark:mix-blend-normal" />
                    <h4 className="font-bold text-brand-dark dark:text-white text-sm">{p.title}</h4>
                  </div>
                ))}

                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-3 border-t border-gray-100 dark:border-white/10">السعر</div>
                {comparedProducts.map(p => (
                  <div key={p.id} className="text-center font-bold text-brand-gold py-3 border-t border-gray-100 dark:border-white/10" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${p.price}
                  </div>
                ))}

                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-3 border-t border-gray-100 dark:border-white/10">التقييم</div>
                {comparedProducts.map(p => (
                  <div key={p.id} className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 border-t border-gray-100 dark:border-white/10">
                    ⭐ {p.rating} / 5
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
