import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, BadgeCheck, MessageSquare, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';

const VendorProfile = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // بيانات النجارين (نفسها الموجودة في صفحة النجارين + تفاصيل إضافية وصور أكثر)
  const allVendors = [
    { id: 1, name: isAr ? 'أحمد النجار' : 'Ahmed Al-Najjar', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 124, experience: '15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متخصص في صناعة الأثاث الكلاسيكي الفاخر بخبرة تمتد لـ 15 عاماً، أعتني بأدق التفاصيل والزخارف اليدوية.' : 'Master craftsman specializing in luxury classic furniture with 15 years of experience.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80'] },
    { id: 2, name: isAr ? 'ورشة الإبداع' : 'Ebdaa Workshop', specialty: t('specialty_modern'), rating: 4, verified: false, location: isAr ? 'بغداد' : 'Baghdad', projectsCount: 89, experience: '8', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80', cover: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80', about: isAr ? 'نقدم حلولاً عصرية ومبتكرة للمساحات الحديثة باستخدام أجود أنواع الخشب والمعادن.' : 'We provide modern and innovative solutions for contemporary spaces using premium wood.', portfolio: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80', 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80', 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=600&q=80', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80'] }
    // يمكن إضافة البقية هنا...
  ];

  // البحث عن النجار المطلوب
  const vendor = allVendors.find(v => v.id === parseInt(id)) || allVendors[0]; // في حال لم يجده يعرض الأول للتجربة

  if (!vendor) return <div className="min-h-screen flex items-center justify-center text-xl text-brand-dark">{t('vendor_not_found')}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      
      {/* 1. Cover & Avatar Section */}
      <section className="relative w-full h-[35vh] md:h-[45vh] bg-brand-dark">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${vendor.cover})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-transparent"></div>
        
        {/* زر العودة */}
        <Link to="/vendors" className="absolute top-6 right-6 md:right-16 z-20 flex items-center gap-2 text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors text-sm">
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('back_to_vendors')}
        </Link>
      </section>

      {/* 2. Vendor Info Container (مرفوع قليلاً للأعلى) */}
      <section className="relative z-10 px-6 md:px-16 max-w-6xl mx-auto w-full -mt-24 md:-mt-32 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col items-center text-center sticky top-24">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-16 mb-4 bg-white">
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            
            <h1 className={`text-2xl md:text-3xl font-bold text-brand-dark flex items-center justify-center gap-2 mb-1 ${isAr ? '' : 'font-serif'}`}>
              {vendor.name} {vendor.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </h1>
            <p className="text-brand-gold font-medium mb-4">{vendor.specialty}</p>
            
            <div className="flex items-center justify-center gap-1 text-brand-dark/40 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < vendor.rating ? 'fill-brand-gold text-brand-gold' : ''}`} />
              ))}
            </div>
            
            <div className="w-full space-y-4 border-t border-gray-100 pt-6 mb-6 text-sm">
              <div className="flex justify-between items-center text-gray-600"><span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {t('location')}</span> <span className="font-bold text-brand-dark">{vendor.location}</span></div>
              <div className="flex justify-between items-center text-gray-600"><span className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> {t('projects')}</span> <span className="font-bold text-brand-dark">+{vendor.projectsCount}</span></div>
              <div className="flex justify-between items-center text-gray-600"><span className="flex items-center gap-2"><Star className="w-4 h-4"/> {t('experience')}</span> <span className="font-bold text-brand-dark">{vendor.experience}</span></div>
            </div>

            <button className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-brand-gold transition-colors mb-3 flex items-center justify-center gap-2 shadow-lg">
              {t('hire_me')}
            </button>
            <button className="w-full border-2 border-gray-100 text-brand-dark py-3 rounded-lg font-bold hover:border-brand-gold hover:text-brand-gold transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4"/> {t('contact_vendor')}
            </button>
          </div>
        </div>

        {/* Main Content (About & Portfolio) */}
        <div className="w-full md:w-2/3 flex flex-col gap-10 mt-4 md:mt-24">
          
          {/* About Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className={`text-2xl font-bold text-brand-dark mb-4 ${isAr ? '' : 'font-serif'}`}>{t('about_vendor')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">{vendor.about}</p>
          </div>

          {/* Portfolio Section */}
          <div>
            <h2 className={`text-2xl font-bold text-brand-dark mb-6 ${isAr ? '' : 'font-serif'}`}>{t('portfolio')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vendor.portfolio.map((img, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl overflow-hidden h-64 shadow-sm group cursor-pointer"
                >
                  <img src={img} alt="work" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      <div className="pb-24"></div>
    </div>
  );
};

export default VendorProfile;
