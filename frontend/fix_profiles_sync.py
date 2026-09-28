import os
import re

profile_path = os.path.expanduser("~/San3a/frontend/src/pages/VendorProfile.jsx")

if os.path.exists(profile_path):
    with open(profile_path, "r", encoding="utf-8") as f:
        code = f.read()

    new_vendors = """
    ,{ id: 3, name: isAr ? 'محمد علي' : 'Mohammed Ali', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'أربيل' : 'Erbil', projectsCount: 340, experience: '22', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متمرس في النقش اليدوي وتصميم الصالونات.' : 'Experienced craftsman.', portfolio: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80'] },
    { id: 4, name: isAr ? 'لمسة خشب' : 'Wood Touch', specialty: t('specialty_modern'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 56, experience: '5', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', cover: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80', about: isAr ? 'ورشة شبابية تهتم بالديكورات المودرن.' : 'Youth workshop for modern decor.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'] }"""

    # 1. إضافة النجارين الناقصين لتفادي العودة لأحمد النجار
    if "محمد علي" not in code:
        if "// يمكن إضافة البقية هنا..." in code:
            code = code.replace("// يمكن إضافة البقية هنا...", new_vendors)
        else:
            code = re.sub(r'(\{\s*id:\s*2[^}]+\}(?:\s*,)?)\s*\];', r'\1' + new_vendors + '\n  ];', code, flags=re.DOTALL)

    # 2. حل جذري لمشكلة مطابقة الحسابات الجديدة (مثل ملاك) 
    code = re.sub(
        r'let vendor = combinedVendors\.find[^;]+;', 
        'let vendor = combinedVendors.find(v => String(v.id) === String(id) || String(v.name) === String(id)) || allVendors[0];', 
        code
    )

    with open(profile_path, "w", encoding="utf-8") as f:
        f.write(code)
        
    print("✅ تم حل مشكلة توجيه الملفات لجميع النجارين وحساب ملاك بنجاح!")
else:
    print("⚠️ ملف VendorProfile.jsx غير موجود.")
