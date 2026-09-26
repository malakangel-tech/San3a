import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* هيدر تعريفي فاخر */}
      <section className="bg-brand-dark text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-brand-dark to-brand-dark"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isAr ? '' : 'font-serif'}`}>{t('about_title')}</h1>
          <p className="text-gray-300 text-lg md:text-xl font-light">{t('about_subtitle')}</p>
        </motion.div>
      </section>

      {/* محتوى القصة */}
      <section className="py-20 px-6 md:px-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: isAr ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <p className="text-gray-700 leading-relaxed text-lg font-light">{t('about_text1')}</p>
            <p className="text-gray-700 leading-relaxed text-lg font-light">{t('about_text2')}</p>
          </motion.div>
          <div className="rounded-2xl overflow-hidden shadow-xl h-80">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" alt="Workshop" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* مميزات الشركة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
            <Award className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-bold text-brand-dark text-lg mb-2">جودة استثنائية</h3>
            <p className="text-gray-500 text-sm">نستخدم أجود أنواع الأخشاب والخامات العالمية.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
            <ShieldCheck className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-bold text-brand-dark text-lg mb-2">ضمان شامل</h3>
            <p className="text-gray-500 text-sm">ضمان حقيقي لمدة 5 سنوات على كافة قطع الأثاث.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
            <HeartHandshake className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-bold text-brand-dark text-lg mb-2">ثقة وموثوقية</h3>
            <p className="text-gray-500 text-sm">نتعامل مع نخبة الحرفيين المعتمدين في العراق.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
