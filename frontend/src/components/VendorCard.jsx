import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Briefcase, BadgeCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// أضفنا (id) هنا لكي نعرف أي نجار نضغط عليه
const VendorCard = ({ id, image, name, specialty, rating, verified, location, projectsCount, experience, portfolio }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-brand-gold/30 transition-all duration-500 flex flex-col group relative"
    >
      {verified && (
        <div className="absolute top-4 left-4 right-auto bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 z-10">
          <BadgeCheck className="w-3 h-3" /> {t('verified')}
        </div>
      )}

      <div className="flex flex-col items-center text-center mt-2 mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 p-1 border-2 border-gray-100 group-hover:border-brand-gold transition-colors duration-300">
          <img src={image} alt={name} className="w-full h-full object-cover rounded-full" />
        </div>
        <h3 className={`text-xl font-bold text-brand-dark flex items-center justify-center gap-1 ${isAr ? '' : 'font-serif'}`}>
          {name}
        </h3>
        <p className="text-brand-gold text-xs font-medium tracking-wide mt-1">{specialty}</p>
      </div>
      
      {(location || projectsCount || experience) && (
        <div className="grid grid-cols-3 gap-2 border-y border-gray-100 py-3 mb-4 text-center">
          <div className="flex flex-col items-center justify-center">
            <MapPin className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase">{t('location')}</span>
            <span className="text-xs font-bold text-brand-dark">{location || '-'}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-gray-100">
            <Briefcase className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase">{t('projects')}</span>
            <span className="text-xs font-bold text-brand-dark">{projectsCount ? `+${projectsCount}` : '-'}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Star className="w-4 h-4 text-brand-gold mb-1" />
            <span className="text-[10px] text-gray-500 uppercase">{t('experience')}</span>
            <span className="text-xs font-bold text-brand-dark">{experience || '-'}</span>
          </div>
        </div>
      )}

      {portfolio && portfolio.length > 0 && (
        <div className="flex gap-2 mb-5">
          {portfolio.slice(0, 3).map((img, idx) => (
            <div key={idx} className="h-12 flex-1 rounded-md overflow-hidden bg-gray-50">
              <img src={img} alt="work" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            </div>
          ))}
        </div>
      )}
      
      {/* تحويل الزر إلى رابط ذكي */}
      <Link to={`/vendor/${id}`} className="mt-auto w-full flex items-center justify-center py-2.5 bg-gray-50 rounded-lg text-sm font-semibold text-brand-dark hover:bg-brand-gold hover:text-white transition-colors duration-300">
        {t('view_profile')} 
        {isAr ? <ChevronLeft className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
      </Link>
    </motion.div>
  );
};

export default VendorCard;
