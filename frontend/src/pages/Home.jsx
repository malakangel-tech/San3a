import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const products = [
    { id: 1, title: isAr ? 'أريكة عصرية' : 'Modern Sofa', price: '850', rating: 4, isCustomizable: true, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
    { id: 2, title: isAr ? 'طاولة خشبية' : 'Wooden Table', price: '420', rating: 5, isCustomizable: false, image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500&q=80' },
    { id: 3, title: isAr ? 'كرسي كلاسيك' : 'Classic Chair', price: '210', rating: 5, isCustomizable: true, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
    { id: 4, title: isAr ? 'أريكة مخملية' : 'Velvet Sofa', price: '980', rating: 4, isCustomizable: false, image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=500&q=80' },
  ];

  const vendors = [
    { id: 1, name: isAr ? 'أحمد النجار' : 'Ahmed Al-Najjar', specialty: t('specialty_classic'), rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { id: 2, name: isAr ? 'ورشة الإبداع' : 'Ebdaa Workshop', specialty: t('specialty_modern'), rating: 4, image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80' },
    { id: 3, name: isAr ? 'محمد علي' : 'Mohammed Ali', specialty: t('specialty_classic'), rating: 5, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-start px-6 md:px-20 overflow-hidden">
        <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 z-0 mx-4 md:mx-10 my-4 rounded-lg overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative z-10 max-w-2xl pt-10">
          <p className="text-brand-gold text-xs md:text-sm tracking-[0.2em] uppercase mb-4 font-bold">{t('hero_tag')}</p>
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 ${isAr ? '' : 'font-serif'}`} dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
          <p className="text-gray-200 text-sm md:text-base mb-10 leading-relaxed font-light max-w-lg">{t('hero_desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-brand-dark px-8 py-4 rounded-sm text-sm font-bold uppercase tracking-wide">{t('btn_explore')}</motion.button>
            <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.95 }} className="border border-white/70 text-white px-8 py-4 rounded-sm text-sm font-bold uppercase tracking-wide backdrop-blur-md">{t('btn_custom')}</motion.button>
          </div>
        </motion.div>
      </section>

      {/* 2. Marketplace Section */}
      <section className="py-24 px-6 md:px-16">
        <motion.h2 initial={{ opacity: 0, x: isAr ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`text-2xl md:text-4xl font-bold text-brand-dark mb-12 ${isAr ? '' : 'font-serif'}`}>
          {t('marketplace')}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* 3. Top Vendors Section */}
      <section className="py-20 px-6 md:px-16 bg-white border-t border-gray-100">
        <div className="flex justify-between items-end mb-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-2xl md:text-4xl font-bold text-brand-dark ${isAr ? '' : 'font-serif'}`}>
            {t('top_vendors')}
          </motion.h2>
          <button className="text-sm font-bold text-brand-gold hover:text-brand-dark transition-colors uppercase tracking-wide">
            {isAr ? 'عرض الكل' : 'View All'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} {...vendor} />
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default Home;
