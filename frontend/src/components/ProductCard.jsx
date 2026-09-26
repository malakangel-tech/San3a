import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Star, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ id, image, title, price, rating, isCustomizable, onCompare, isCompared }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 relative flex flex-col h-full border border-gray-100 dark:border-white/10 group"
    >
      <div className="relative w-full h-56 md:h-64 rounded-lg overflow-hidden bg-[#F5F5F5] dark:bg-black/30 mb-4 flex items-center justify-center">
        <Link to={`/product/${id}`} className="absolute inset-0 z-10 w-full h-full"></Link>

        <img src={image} alt={title} className="w-4/5 h-4/5 object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700" />
        
        {isCustomizable && (
          <div className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold px-3 py-1 rounded-sm tracking-wider uppercase shadow-md z-20 pointer-events-none">
            {t('customizable')}
          </div>
        )}
        
        {/* زر المقارنة السريع */}
        <button 
          onClick={(e) => { e.stopPropagation(); onCompare && onCompare({ id, image, title, price, rating }); }}
          className={`absolute top-3 right-12 p-2 rounded-full transition-colors z-20 ${isCompared ? 'bg-brand-gold text-white' : 'bg-white/80 dark:bg-black/60 text-gray-600 dark:text-gray-300 hover:text-brand-gold'}`}
          title="مقارنة المنتج"
        >
          <Scale className="w-4 h-4" />
        </button>

        <button onClick={(e) => e.stopPropagation()} className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/60 rounded-full text-gray-400 hover:text-red-500 transition-colors z-20">
          <Heart className="w-4 h-4" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Link to={`/product/${id}`} className="bg-brand-dark text-white p-2 rounded-md hover:bg-brand-gold transition shadow-lg">
             <Eye className="w-4 h-4"/>
           </Link>
           <button className="bg-white text-brand-dark p-2 rounded-md hover:bg-brand-gold hover:text-white transition shadow-lg">
             <ShoppingCart className="w-4 h-4"/>
           </button>
        </div>
      </div>

      <div className="flex flex-col flex-grow px-2 z-20 relative">
        <div className="text-2xl font-bold text-brand-dark dark:text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>${price}</div>
        
        <Link to={`/product/${id}`} className={`text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 hover:text-brand-gold transition-colors block ${isAr ? '' : 'font-serif'}`}>
          {title}
        </Link>
        
        <div className="flex text-brand-gold mb-6 gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-200'}`} />
          ))}
        </div>
        
        <Link to={`/product/${id}`} className="mt-auto w-full text-center bg-brand-gold/10 text-brand-gold border border-brand-gold/30 py-3 rounded-sm font-bold hover:bg-brand-gold hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs block">
          {isAr ? 'عرض التفاصيل' : 'View Details'}
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
