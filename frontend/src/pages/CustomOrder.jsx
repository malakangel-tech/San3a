import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Calculator, CheckCircle, Sparkles } from 'lucide-react';
import { apiFetch } from '../services/api';

const CustomOrder = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [furnitureType, setFurnitureType] = useState('sofa');
  const [woodType, setWoodType] = useState('beech');
  const [size, setSize] = useState('medium');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculatePrice = () => {
    let base = 500;
    if (furnitureType === 'table') base = 600;
    if (woodType === 'beech') base += 120;
    if (size === 'large') base += 250;
    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/custom-orders', {
        method: 'POST',
        body: JSON.stringify({
          furniture_type: furnitureType,
          wood_type: woodType,
          size: size,
          details: details,
          estimated_price: calculatePrice()
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('CUSTOM ORDER ERROR:', err);
      setError(err.message || 'Failed to create custom order');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl text-center text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

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
                  <option value="sofa">{isAr ? 'أريكة / صوفا فاخرة' : 'Sofa'}</option>
                  <option value="table">{isAr ? 'طاولة طعام خشبية' : 'Table'}</option>
                  <option value="cabinet">{isAr ? 'خزانة ملابس مخصصة' : 'Cabinet'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'نوع الخشب' : 'Wood Type'}</label>
                <select
                  value={woodType}
                  onChange={(e) => setWoodType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg:black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
                >
                  <option value="beech">{isAr ? 'خشب زان طبيعي' : 'Beech'}</option>
                  <option value="oak">{isAr ? 'خشب بلوط فاخر' : 'Oak'}</option>
                  <option value="mdf">{isAr ? 'خشب MDF اسباني' : 'MDF'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'الحجم' : 'Size'}</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-gray-50 dark:bg:black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
                >
                  <option value="small">{isAr ? 'صغير' : 'Small'}</option>
                  <option value="medium">{isAr ? 'متوسط' : 'Medium'}</option>
                  <option value="large">{isAr ? 'كبير' : 'Large'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'تفاصيل إضافية' : 'Additional Details'}</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows="3"
                placeholder={isAr ? 'اكتب أي تفاصيل إضافية...' : 'Write any additional details...'}
                className="w-full bg-gray-50 dark:bg:black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white resize-none"
              ></textarea>
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
              disabled={loading}
              className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg hover:bg-brand-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال طلب التفصيل للحرفيين' : 'Send Custom Order')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomOrder;
