import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, BadgeCheck, MessageSquare, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';

const VendorProfile = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const allVendors = [
    { id: 1, name: isAr ? 'أحمد النجار' : 'Ahmed Al-Najjar', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 124, experience: '15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متخصص في صناعة الأثاث الكلاسيكي الفاخر بخبرة تمتد لـ 15 عاماً، أعتني بأدق التفاصيل والزخارف اليدوية.' : 'Master craftsman specializing in luxury classic furniture with 15 years of experience.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80'] },
    { id: 2, name: isAr ? 'ورشة الإبداع' : 'Ebdaa Workshop', specialty: t('specialty_modern'), rating: 4, verified: false, location: isAr ? 'بغداد' : 'Baghdad', projectsCount: 89, experience: '8', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80', cover: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80', about: isAr ? 'نقدم حلولاً عصرية ومبتكرة للمساحات الحديثة باستخدام أجود أنواع الخشب والمعادن.' : 'We provide modern and innovative solutions for contemporary spaces using premium wood.', portfolio: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80', 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80', 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=600&q=80', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80'] },
    { id: 3, name: isAr ? 'محمد علي' : 'Mohammed Ali', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'أربيل' : 'Erbil', projectsCount: 340, experience: '22', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متمرس في النقش اليدوي وتصميم الصالونات.' : 'Experienced craftsman.', portfolio: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80'] },
    { id: 4, name: isAr ? 'لمسة خشب' : 'Wood Touch', specialty: t('specialty_modern'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 56, experience: '5', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', cover: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80', about: isAr ? 'ورشة شبابية تهتم بالديكورات المودرن.' : 'Youth workshop for modern decor.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'] }
  ];

  const localVendors = JSON.parse(localStorage.getItem('newVendors')) || [];
  const combinedVendors = [...allVendors, ...localVendors];
  
  let vendor = combinedVendors.find(v => String(v.id) === String(id) || String(v.name) === String(id)) || allVendors[0];

  // مزامنة حساب ملاك (أو أي نجار محلي) مع بيانات لوحة التحكم
  if (localVendors.some(v => String(v.id) === String(vendor.id))) {
    const savedPortfolio = JSON.parse(localStorage.getItem('craftsmanPortfolio') || '[]');
    const savedBio = localStorage.getItem('userBio') || '';
    vendor = {
      ...vendor,
      about: savedBio || (isAr ? 'نجار محترف يقدم خدمات التفصيل والصيانة.' : 'Professional craftsman.'),
      portfolio: savedPortfolio.map(item => item.image)
    };
  }

  if (!vendor) return <div className="min-h-screen flex items-center justify-center text-xl text-brand-dark dark:text-white">{t('vendor_not_found')}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212]">
      <section className="relative w-full h-[35vh] md:h-[45vh] bg-brand-dark">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${vendor.cover || 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80'})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-transparent"></div>
        <Link to="/vendors" className="absolute top-6 right-6 md:right-16 z-20 flex items-center gap-2 text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors text-sm">
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('back_to_vendors')}
        </Link>
      </section>

      <section className="relative z-10 px-6 md:px-16 max-w-6xl mx-auto w-full -mt-24 md:-mt-32 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-white/10 flex flex-col items-center text-center sticky top-24">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-16 mb-4 bg-white dark:bg-[#1E1E1E]">
              <img src={vendor.image || 'https://via.placeholder.com/150'} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold text-brand-dark dark:text-white flex items-center justify-center gap-2 mb-1 ${isAr ? '' : 'font-serif'}`}>
              {vendor.name} {vendor.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </h1>
            <p className="text-brand-gold font-medium mb-4">{vendor.specialty || (isAr ? 'نجار عام' : 'General Carpenter')}</p>
            <div className="flex items-center justify-center gap-1 text-brand-dark dark:text-white/40 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < (vendor.rating || 5) ? 'fill-brand-gold text-brand-gold' : ''}`} />
              ))}
            </div>
            <div className="w-full space-y-4 border-t border-gray-100 dark:border-white/10 pt-6 mb-6 text-sm">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300"><span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {t('location')}</span> <span className="font-bold text-brand-dark dark:text-white">{vendor.location || (isAr ? 'البصرة' : 'Basra')}</span></div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300"><span className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> {t('projects')}</span> <span className="font-bold text-brand-dark dark:text-white">+{vendor.projectsCount || 0}</span></div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300"><span className="flex items-center gap-2"><Star className="w-4 h-4"/> {t('experience')}</span> <span className="font-bold text-brand-dark dark:text-white">{vendor.experience || 0}</span></div>
            </div>
            <Link 
  to={`/custom?vendor=${vendor.id}`} 
  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl text-center block transition duration-200"
>
  {isAr ? 'طلب تفصيل خاص' : 'Custom Order'}
</Link>



          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-10 mt-4 md:mt-24">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/10">
            <h2 className={`text-2xl font-bold text-brand-dark dark:text-white mb-4 ${isAr ? '' : 'font-serif'}`}>{t('about_vendor')}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">{vendor.about}</p>
          </div>

          <div>
            <h2 className={`text-2xl font-bold text-brand-dark dark:text-white mb-6 ${isAr ? '' : 'font-serif'}`}>{t('portfolio')}</h2>
            {vendor.portfolio && vendor.portfolio.length > 0 ? (
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
            ) : (
              <div className="bg-gray-50 dark:bg-black/20 p-8 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                <p className="text-gray-400 dark:text-gray-500">{isAr ? 'لم يقم الحرفي بإضافة أعمال لمعرضه بعد.' : 'No items in portfolio yet.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="pb-24"></div>
    </div>
  );
};

export default VendorProfile;
