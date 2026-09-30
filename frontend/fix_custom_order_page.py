import os

# 1. التأكد من وجود مجلد الصفحات وإنشاء صفحة CustomOrder.jsx متكاملة
pages_dir = os.path.expanduser("~/San3a/frontend/src/pages")
os.makedirs(pages_dir, exist_ok=True)

custom_order_path = os.path.join(pages_dir, "CustomOrder.jsx")

custom_order_code = """import React, { useState } from 'react';
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

  // حساب التكلفة الفورية تقريبياً بناءً الاختيارات
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
    
    // حفظ الطلب في الذاكرة لتستلمه ورشة النجار
    const existingOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
    localStorage.setItem('customOrders', JSON.stringify([newOrder, ...existingOrders]));
    
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#121212] py-10 px-4 md:px-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-gold" />
            {isAr ? 'صمم قطعة أثاثك الفريدة' : 'Design Your Unique Furniture'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isAr ? 'أخبرنا برؤيتك، اختر خاماتك، واحصل على تقدير فوري للتكلفة قبل أن يحولها نخبة حرفيينا إلى حقيقة.' : 'Tell us your vision and get an instant estimate.'}
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-8 rounded-2xl text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
              {isAr ? 'تم إرسال طلب التفصيل للحرفيين بنجاح!' : 'Custom order sent successfully!'}
            </h3>
            <p className="text-xs text-green-700 dark:text-green-400">
              {isAr ? 'سيقوم النجارون بمراجعة طلبك وإرسال العروض القريبة لك قريباً.' : 'Craftsmen will review your order shortly.'}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-brand-dark dark:bg-brand-gold text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase"
            >
              {isAr ? 'إرسال طلب آخر' : 'Send Another Order'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            
            {/* Form Box */}
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
                    <option value="سرير غرف نوم رئيسية">سرير غرف نوم رئيسية</option>
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
                    <option value="خشب جوز طبيعي">خشب جوز طبيعي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'الحجم التقريبي' : 'Approximate Size'}</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white text-xs"
                >
                  <option value="صغير (حجم مفرد / شخصين)">صغير (حجم مفرد / شخصين)</option>
                  <option value="متوسط (3 إلى 4 اشخاص)">متوسط (3 إلى 4 اشخاص)</option>
                  <option value="كبير (مساحات واسعة / تفصيل خاص)">كبير (مساحات واسعة / تفصيل خاص)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-2">{isAr ? 'المقاسات الدقيقة بالممتار أو أي تفاصيل خاصة...' : 'Precise measurements or custom details...'}</label>
                <textarea
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={isAr ? 'اكتب المقاسات الدقيقة للأمتار أو أي تفاصيل خاصة...' : 'Enter precise measurements...'}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white text-xs resize-none"
                ></textarea>
              </div>

              {/* Instant Price Calculator Widget matching the screenshot */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-6 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-brand-dark dark:text-white font-bold text-xs">
                  <Calculator className="w-4 h-4 text-brand-gold" />
                  <span>{isAr ? 'حاسبة التكلفة الفورية' : 'Instant Cost Calculator'}</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {isAr ? 'هذا السعر تقديري بناءً على المقاسات الحالية وقابل للتحديث عند مناقشة التفاصيل مع النجار المختص.' : 'Estimated price based on current selections.'}
                </p>
                <div className="text-3xl font-extrabold text-brand-dark dark:text-white">
                  ${calculatePrice()}
                </div>
                <div className="text-[10px] text-gray-400">
                  {isAr ? '⏱️ الوقت الإنجاز المتوقع: 10 - 14 يوم' : 'Estimated completion: 10-14 days'}
                </div>
              </div>

              <button
                type="submit"
                w-full=""
                className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isAr ? 'إرسال طلب التفصيل للحرفيين' : 'Send Custom Order to Craftsmen'}</span>
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default CustomOrder;
"""

with open(custom_order_path, "w", encoding="utf-8") as f:
    f.write(custom_order_code)

print("✅ تم إنشاء صفحة CustomOrder.jsx بنجاح!")

# 2. إضافة المسار في App.jsx لضمان عدم ظهور الشاشة البيضاء
app_path = os.path.expanduser("~/San3a/frontend/src/App.jsx")
if os.path.exists(app_path):
    with open(app_path, "r", encoding="utf-8") as f:
        app_code = f.read()

    if "import CustomOrder from" not in app_code:
        app_code = app_code.replace("import Dashboard from './pages/Dashboard';", "import Dashboard from './pages/Dashboard';\nimport CustomOrder from './pages/CustomOrder';")
    
    if '<Route path="/custom-order"' not in app_code:
        app_code = app_code.replace('<Route path="/dashboard" element={<Dashboard />} />', '<Route path="/dashboard" element={<Dashboard />} />\n          <Route path="/custom-order" element={<CustomOrder />} />')
        
        with open(app_path, "w", encoding="utf-8") as f:
            f.write(app_code)
        print("✅ تم ربط مسار /custom-order بـ App.jsx بنجاح!")
