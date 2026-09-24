import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import VendorCard from '../components/VendorCard';

const Vendors = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات نجارين مفصلة جداً
  const allVendors = [
    { id: 1, name: isAr ? 'أحمد النجار' : 'Ahmed Al-Najjar', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 124, experience: '15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=100&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'] },
    { id: 2, name: isAr ? 'ورشة الإبداع' : 'Ebdaa Workshop', specialty: t('specialty_modern'), rating: 4, verified: false, location: isAr ? 'بغداد' : 'Baghdad', projectsCount: 89, experience: '8', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80', portfolio: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=100&q=80', 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=100&q=80', 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=100&q=80'] },
    { id: 3, name: isAr ? 'محمد علي' : 'Mohammed Ali', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'أربيل' : 'Erbil', projectsCount: 340, experience: '22', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80', portfolio: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=100&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=100&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=100&q=80'] },
    { id: 4, name: isAr ? 'لمسة خشب' : 'Wood Touch', specialty: t('specialty_modern'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 56, experience: '5', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80', 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=100&q=80', 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=100&q=80'] }
  ];

  const filteredVendors = allVendors.filter(vendor => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      
      {/* 1. Luxury Header */}
      <section className="relative w-full h-[45vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 px-6 mt-10">
          <h1 className={`text-4xl md:text-6xl font-bold text-white mb-4 ${isAr ? '' : 'font-serif'}`}>{t('vendors_hero_title')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">{t('vendors_hero_desc')}</p>
        </motion.div>
      </section>

      {/* 2. Main Content (Filters Sidebar + Grid) */}
      <section className="py-12 px-6 md:px-12 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters (فلاتر جانبية) */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg">
              <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
              {t('filters')}
            </div>

            {/* البحث */}
            <div className="mb-6 relative">
              <Search className={`w-4 h-4 text-gray-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
              <input 
                type="text" placeholder={t('search_vendor')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-2 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm outline-none focus:border-brand-gold transition-colors`}
              />
            </div>

            {/* فلتر المدينة */}
            <div className="mb-6 border-t border-gray-100 pt-4">
              <h4 className="font-semibold text-brand-dark mb-3 text-sm">{t('location')}</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-gold"><input type="checkbox" className="accent-brand-gold" /> {isAr ? 'البصرة' : 'Basra'}</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-gold"><input type="checkbox" className="accent-brand-gold" /> {isAr ? 'بغداد' : 'Baghdad'}</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-gold"><input type="checkbox" className="accent-brand-gold" /> {isAr ? 'أربيل' : 'Erbil'}</label>
              </div>
            </div>

            {/* فلتر التوثيق */}
            <div className="border-t border-gray-100 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-dark hover:text-brand-gold">
                <input type="checkbox" className="accent-brand-gold w-4 h-4" defaultChecked />
                {t('verified')} فقط
              </label>
            </div>
          </div>
        </div>

        {/* Vendors Grid Area */}
        <div className="lg:w-3/4 flex flex-col">
          {/* شريط الترتيب العلوي */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-bold text-gray-600">
              {filteredVendors.length} {isAr ? 'حرفيين متاحين' : 'Craftsmen found'}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-brand-gold">
              {t('sort_by')}: <span className="font-bold text-brand-dark">{t('highest_rated')}</span> <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* شبكة البطاقات */}
          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVendors.map((vendor, index) => (
                <motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <VendorCard {...vendor} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-lg text-gray-400">لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Vendors;
