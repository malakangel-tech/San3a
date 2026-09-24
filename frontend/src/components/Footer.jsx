import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 px-6 md:px-16 border-t-[6px] border-brand-gold">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-12">
        
        {/* اللوجو والوصف */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold tracking-wider mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>San3a</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            {t('footer_desc')}
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-brand-gold">{t('links')}</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">{t('furniture')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('custom')}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">{t('vendors')}</a></li>
          </ul>
        </div>

        {/* المساعدة */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-brand-gold">{t('support')}</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
            <li><a href="#" className="hover:text-white transition-colors">سياسة الإرجاع</a></li>
            <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
          </ul>
        </div>

        {/* النشرة البريدية */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-brand-gold">ابقَ على اطلاع</h3>
          <p className="text-xs text-gray-400 mb-4">اشترك ليصلك جديد التصاميم والعروض.</p>
          <div className={`flex ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
            <input type="email" placeholder="البريد الإلكتروني" className="bg-white/5 border border-white/10 px-4 py-2 w-full outline-none focus:border-brand-gold text-sm rounded-r-md" />
            <button className="bg-brand-gold text-white px-4 py-2 text-sm font-bold rounded-l-md hover:bg-brand-gold/80">اشترك</button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} San3a Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
