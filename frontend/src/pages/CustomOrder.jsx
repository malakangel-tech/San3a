import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Calculator, CheckCircle, Sparkles } from 'lucide-react';

const CustomOrder = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [furnitureType, setFurnitureType] = useState('أريكة / صوفا فاخرة');
  const [woodType, setWoodType] = useState('خشب زان طبيعي');
  const [size, setSize] = useState('متوسط (3 إلى 4 اشخاص)');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const calculatePrice = () => {
    let base = 500;
    if (furnitureType.includes('طاولة')) base = 600;
    if (woodType.includes('زان')) base += 120;
    if (size.includes('كبير')) base += 250;
    return base;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now(),
      customer: 'مستخدم محلي',
      type: furnitureType,
      details: `${size} / ${woodType} - ${details}`,
      status: 'جديد'
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
    localStorage.setItem('customOrders', JSON.stringify([newOrder, ...existingOrders]));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#121212] py-10 px-4 md:px-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-gold" />
            {isAr ? 'صمم قطعة أثاثك الفريدة' : 'Design Your Unique Furniture'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isAr ? 'أخبرنا برؤيتك، اختر خاماتك، واحصل على تقدير فوري للتكلفة.' : 'Tell us your vision and get an instant estimate.'}
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-8 rounded-2xl text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
              {isAr ? 'تم إرسال طلب التفصيل للحرفيين بنجاح!' : 'Custom order sent successfully!'}
            </h3>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-brand-dark dark:bg-brand-gold text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase"
            >
              {isAr ? 'إرسال طلب آخر' : 'Send Another Order'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E1E1E] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'نوع القطعة المطلوبة' : 'Furniture Type'}</label>
                <select
                  value={furnitureType}
                  onChange={(e) => setFurnitureType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
                >
                  <option value="أريكة / صوفا فاخرة">أريكة / صوفا فاخرة</option>
                  <option value="طاولة طعام خشبية">طاولة طعام خشبية</option>
                  <option value="خزانة ملابس مخصصة">خزانة ملابس مخصصة</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'نوع الخشب' : 'Wood Type'}</label>
                <select
                  value={woodType}
                  onChange={(e) => setWoodType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
                >
                  <option value="خشب زان طبيعي">خشب زان طبيعي</option>
                  <option value="خشب بلوط فاخر">خشب بلوط فاخر</option>
                  <option value="خشب MDF اسباني">خشب MDF اسباني</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-6 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-brand-dark dark:text-white font-bold text-xs">
                <Calculator className="w-4 h-4 text-brand-gold" />
                <span>{isAr ? 'حاسبة التكلفة الفورية' : 'Instant Cost Calculator'}</span>
              </div>
              <div className="text-3xl font-extrabold text-brand-dark dark:text-white">
                ${calculatePrice()}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isAr ? 'إرسال طلب التفصيل للحرفيين' : 'Send Custom Order'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomOrder;
