import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, Clock, ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [mainImage, setMainImage] = useState(0);

  // بيانات وهمية للمنتجات (تحاكي الداتابيس)
  const products = [
    { 
      id: 1, title: isAr ? 'أريكة عصرية مخملية' : 'Modern Velvet Sofa', price: '850', rating: 4, reviews: 128,
      desc: isAr ? 'أريكة مصممة بعناية فائقة لتجمع بين الراحة والأناقة المطلقة. مصنوعة من خشب الزان الصلب ومغطاة بطبقة من المخمل الإيطالي الفاخر.' : 'Carefully designed sofa that combines comfort with absolute elegance. Made of solid beech wood and covered with luxurious Italian velvet.',
      dimensions: '220cm x 90cm x 85cm', material: isAr ? 'خشب زان، مخمل، إسفنج عالي الكثافة' : 'Beech wood, Velvet, High-density foam',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=800&q=80'],
      colors: [{ name: 'رمادي داكن', code: '#4A4A4A' }, { name: 'أزرق ملكي', code: '#002366' }, { name: 'بيج كلاسيكي', code: '#D5C4A1' }]
    }
  ];

  const product = products.find(p => p.id === parseInt(id)) || products[0];

  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl">{t('product_not_found')}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      
      {/* مسار التنقل (Breadcrumbs) */}
      <div className="pt-8 px-6 md:px-16 max-w-7xl mx-auto w-full text-sm text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-gold transition-colors">{t('furniture')}</Link>
        {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="text-brand-dark font-medium">{product.title}</span>
      </div>

      <section className="py-8 px-6 md:px-16 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* قسم الصور (Gallery) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-[400px] md:h-[550px] bg-white rounded-2xl p-8 flex items-center justify-center border border-gray-100 shadow-sm relative group overflow-hidden">
            <img src={product.images[mainImage]} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
          </motion.div>
          {/* الصور المصغرة */}
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(idx)}
                className={`w-24 h-24 bg-white rounded-xl p-2 cursor-pointer border-2 transition-colors ${mainImage === idx ? 'border-brand-gold' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* قسم التفاصيل (Product Info) */}
        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-3xl md:text-4xl font-bold text-brand-dark mb-2 ${isAr ? '' : 'font-serif'}`}>
            {product.title}
          </motion.h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-brand-gold">
              {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : 'text-gray-200'}`} />))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer">{product.reviews} {t('reviews')}</span>
          </div>

          <div className="text-3xl font-bold text-brand-dark mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            ${product.price}
          </div>

          {/* الألوان */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-brand-dark mb-3 uppercase tracking-wider">{t('colors')}</h3>
            <div className="flex gap-3">
              {product.colors.map((color, idx) => (
                <div 
                  key={idx} onClick={() => setSelectedColor(idx)}
                  className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all ${selectedColor === idx ? 'ring-2 ring-offset-2 ring-brand-dark scale-110' : 'ring-1 ring-gray-200 hover:scale-110'}`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                ></div>
              ))}
            </div>
          </div>

          {/* الكمية والإضافة للسلة */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-gray-100 pb-10">
            <div className="flex items-center justify-between border border-gray-300 rounded-md w-full sm:w-32 px-4 py-3 bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-brand-dark"><Minus className="w-4 h-4" /></button>
              <span className="font-bold text-brand-dark">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-brand-dark"><Plus className="w-4 h-4" /></button>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-grow bg-brand-dark text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors shadow-lg">
              <ShoppingCart className="w-5 h-5" /> {t('add_to_cart')}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-14 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors bg-white">
              <Heart className="w-5 h-5" />
            </motion.button>
          </div>

          {/* تفاصيل إضافية (الوصف، الأبعاد) */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-brand-dark mb-2 uppercase tracking-wider">{t('description')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{t('dimensions')}</h3>
                <p className="text-sm font-bold text-brand-dark">{product.dimensions}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{t('material')}</h3>
                <p className="text-sm font-bold text-brand-dark">{product.material}</p>
              </div>
            </div>
          </div>

          {/* ميزات المنصة */}
          <div className="mt-10 bg-gray-50 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Truck className="w-5 h-5 text-brand-gold"/> {t('free_shipping')}</div>
            <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><ShieldCheck className="w-5 h-5 text-brand-gold"/> {t('guarantee')}</div>
            <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Clock className="w-5 h-5 text-brand-gold"/> {t('support_247')}</div>
          </div>

        </div>
      </section>

      <div className="pb-24"></div>
    </div>
  );
};

export default ProductDetails;
