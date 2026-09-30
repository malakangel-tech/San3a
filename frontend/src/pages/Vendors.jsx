import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import VendorCard from '../components/VendorCard';
import { apiFetch } from '../services/api';

const Vendors = () => {
  const [localVendors, setLocalVendors] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('newVendors')) || [];
    const currentRole = localStorage.getItem('userRole');
    const currentName = localStorage.getItem('userName');

    if ((currentRole === 'craftsman' || currentRole === 'company') && currentName) {
      if (!stored.some(v => v.name === currentName)) {
        stored.push({ id: Date.now(), name: currentName, rating: 5, verified: true, isVerified: true, specialty: 'نجار عام', location: 'البصرة', image: 'https://via.placeholder.com/150', portfolio: [] });
        localStorage.setItem('newVendors', JSON.stringify(stored));
      }
    }
    setLocalVendors(stored);
  }, []);

  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await apiFetch('/vendors');
        const formattedVendors = data.map(vendor => ({
          id: vendor.id,
          name: vendor.name,
          specialty: vendor.specialty || 'نجار عام',
          rating: vendor.rating || 0,
          verified: vendor.verified || false,
          location: vendor.location || 'غير محدد',
          projectsCount: vendor.projects_count || 0,
          experience: vendor.experience || 0,
          image: vendor.image || 'https://via.placeholder.com/150',
          portfolio: vendor.portfolio || []
        }));
        setVendors(formattedVendors);
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
        setError('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [i18n.language]);

  const filteredVendors = vendors.filter(vendor => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const allFilteredVendors = [...filteredVendors, ...localVendors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212]">
      
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
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2 mb-6 text-brand-dark dark:text-white font-bold text-lg">
              <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
              {t('filters')}
            </div>

            {/* البحث */}
            <div className="mb-6 relative">
              <Search className={`w-4 h-4 text-gray-400 dark:text-gray-500 dark:text-gray-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
              <input 
                type="text" placeholder={t('search_vendor')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-lg py-2 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm outline-none focus:border-brand-gold transition-colors`}
              />
            </div>

            {/* فلتر المدينة */}
            <div className="mb-6 border-t border-gray-100 dark:border-white/10 pt-4">
              <h4 className="font-semibold text-brand-dark dark:text-white mb-3 text-sm">{t('location')}</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-gold"><input type="checkbox" className="accent-brand-gold" /> {isAr ? 'البصرة' : 'Basra'}</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-gold"><input type="checkbox" className="accent-brand-gold" /> {isAr ? 'بغداد' : 'Baghdad'}</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-gold"><input type="checkbox" className="accent-brand-gold" /> {isAr ? 'أربيل' : 'Erbil'}</label>
              </div>
            </div>

            {/* فلتر التوثيق */}
            <div className="border-t border-gray-100 dark:border-white/10 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-dark dark:text-white hover:text-brand-gold">
                <input type="checkbox" className="accent-brand-gold w-4 h-4" defaultChecked />
                {t('verified')} فقط
              </label>
            </div>
          </div>
        </div>

        {/* Vendors Grid Area */}
        <div className="lg:w-3/4 flex flex-col">
          {/* شريط الترتيب العلوي */}
          <div className="flex justify-between items-center mb-6 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
              {allFilteredVendors.length} {isAr ? 'حرفيين متاحين' : 'Craftsmen found'}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-brand-gold">
              {t('sort_by')}: <span className="font-bold text-brand-dark dark:text-white">{t('highest_rated')}</span> <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* شبكة البطاقات */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : allFilteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allFilteredVendors.map((vendor, index) => (
                <motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <VendorCard {...vendor} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-lg text-gray-400 dark:text-gray-500 dark:text-gray-400">لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Vendors;
