import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, BadgeCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorCard = ({ id, name, specialty, rating, verified, location, projectsCount, experience, image, portfolio }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      
      {/* Header / Avatar Info */}
      <div className="p-6 pb-4 flex flex-col items-center text-center relative border-b border-gray-50 dark:border-white/5">
        
        {/* Verified Badge */}
        {verified && (
          <div className="absolute top-4 left-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold">
            <BadgeCheck className="w-3 h-3" /> {isAr ? 'موثوق' : 'Verified'}
          </div>
        )}

        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-gold/30 mb-3 group-hover:scale-105 transition-transform duration-300">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        
        <h3 className={`text-lg font-bold text-brand-dark dark:text-white ${isAr ? '' : 'font-serif'}`}>
          {name}
        </h3>
        <p className="text-brand-gold text-xs font-semibold mt-1">{specialty}</p>
      </div>

      {/* Stats Area */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/10 rtl:divide-x-reverse border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
        <div className="flex flex-col items-center py-3">
          <Star className="w-4 h-4 text-brand-gold mb-1" />
          <span className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'سنوات الخبرة' : 'Experience'}</span>
          <span className="text-xs font-bold text-brand-dark dark:text-white">{experience}</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <Briefcase className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
          <span className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'المشاريع' : 'Projects'}</span>
          <span className="text-xs font-bold text-brand-dark dark:text-white">+{projectsCount}</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
          <span className="text-[10px] text-gray-400 block mb-0.5">{isAr ? 'الموقع' : 'Location'}</span>
          <span className="text-xs font-bold text-brand-dark dark:text-white">{location}</span>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="p-4 flex-grow">
        <div className="flex gap-2">
          {portfolio && portfolio.slice(0, 3).map((img, i) => (
            <div key={i} className="flex-1 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-black/20">
              <img src={img} alt="work" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Button - 🔥 التعديل هنا: يربط الكارت برقم النجار بدقة 🔥 */}
      <div className="p-4 pt-0 mt-auto">
        <Link 
          to={`/vendor/${id}`} 
          className="w-full block text-center bg-gray-50 dark:bg-white/5 hover:bg-brand-gold dark:hover:bg-brand-gold text-brand-dark dark:text-white font-bold text-xs py-3 rounded-xl transition-colors group-hover:text-white"
        >
          {isAr ? 'عرض الملف ‹' : 'View Profile ›'}
        </Link>
      </div>

    </div>
  );
};

export default VendorCard;
