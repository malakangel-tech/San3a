import os
import re

path = os.path.expanduser("~/San3a/frontend/src/pages/VendorProfile.jsx")

if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # الكود الآمن لجلب حساب ملاك ومنتجاتها من الذاكرة المحلية
    replacement = """// جلب الحسابات الجديدة من الذاكرة المحلية
  const localVendors = JSON.parse(localStorage.getItem('newVendors')) || [];
  const combinedVendors = [...allVendors, ...localVendors];

  // البحث عن النجار المطلوب بدقة عبر تحويل الـ ID إلى نصوص لتفادي أخطاء التطابق
  let vendor = combinedVendors.find(v => String(v.id) === String(id) || String(v.name) === String(id)) || allVendors[0];

  // دمج منتجات لوحة التحكم الخاصة بملاك (أو أي نجار محلي) لتظهر في ملفها
  if (localVendors.some(v => String(v.id) === String(vendor.id))) {
    const savedPortfolio = JSON.parse(localStorage.getItem('craftsmanPortfolio') || '[]');
    const savedBio = localStorage.getItem('userBio') || '';
    vendor = {
      ...vendor,
      about: savedBio || (isAr ? 'نجار محترف يقدم خدمات التفصيل والصيانة.' : 'Professional craftsman.'),
      portfolio: savedPortfolio.map(item => item.image)
    };
  }"""

    # استبدال سطر البحث القديم بالكود الجديد الآمن
    code = re.sub(r'const vendor = allVendors\.find\([^)]+\)\s*\|\|\s*allVendors\[0\];.*', replacement, code)

    # إضافة النجارين الناقصين لتجنب أي مشاكل للنجارين الآخرين
    missing_vendors = """
    , { id: 3, name: isAr ? 'محمد علي' : 'Mohammed Ali', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'أربيل' : 'Erbil', projectsCount: 340, experience: '22', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متمرس في النقش اليدوي وتصميم الصالونات.' : 'Experienced craftsman.', portfolio: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80'] },
    { id: 4, name: isAr ? 'لمسة خشب' : 'Wood Touch', specialty: t('specialty_modern'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 56, experience: '5', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', cover: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80', about: isAr ? 'ورشة شبابية تهتم بالديكورات المودرن.' : 'Youth workshop for modern decor.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'] }"""
    
    if "محمد علي" not in code:
        code = code.replace("// يمكن إضافة البقية هنا...", missing_vendors)

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم ربط ملف ملاك ومنتجاتها بنجاح تام!")
else:
    print("⚠️ ملف VendorProfile.jsx غير موجود.")
