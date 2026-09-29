import os
import re

profile_path = os.path.expanduser("~/San3a/frontend/src/pages/VendorProfile.jsx")

if os.path.exists(profile_path):
    with open(profile_path, "r", encoding="utf-8") as f:
        code = f.read()

    # الكود القديم الذي سنبحث عنه
    pattern = r"const localVendors = JSON\.parse\(localStorage\.getItem\('newVendors'\)\) \|\| \[\];\s*const combinedVendors = \[\.\.\.allVendors, \.\.\.localVendors\];\s*const vendor = combinedVendors\.find\(v => v\.id\.toString\(\) === id\?\.toString\(\)\) \|\| allVendors\[0\];"
    
    # الكود الجديد الذي يربط منتجات لوحة التحكم بالملف الشخصي
    replacement = """const localVendors = JSON.parse(localStorage.getItem('newVendors')) || [];
  const combinedVendors = [...allVendors, ...localVendors];
  let vendor = combinedVendors.find(v => v.id.toString() === id?.toString()) || allVendors[0];

  // جلب المنتجات والنبذة التي أضافها النجار من لوحة التحكم
  const savedPortfolio = JSON.parse(localStorage.getItem('craftsmanPortfolio') || '[]');
  const savedBio = localStorage.getItem('userBio') || '';

  // إذا كان الحساب الظاهر هو حساب محلي (مثل حساب ملاك)، نقوم بدمج بيانات لوحة التحكم معه
  if (localVendors.some(v => v.id.toString() === vendor.id.toString())) {
    vendor = {
      ...vendor,
      about: savedBio || 'نجار محترف يقدم خدمات التفصيل والصيانة.',
      // تحويل كائنات المنتجات إلى مصفوفة روابط صور لتعرض في المعرض
      portfolio: savedPortfolio.map(item => item.image)
    };
  }"""

    # إجراء الاستبدال إذا لم يتم مسبقاً
    if "savedPortfolio.map" not in code:
        new_code = re.sub(pattern, replacement, code)
        # للتأكد من نجاح الاستبدال في حال اختلاف طفيف في المسافات
        if new_code == code:
            # طريقة بديلة للاستبدال إذا فشل الـ Regex
            search_str = "const vendor = combinedVendors.find(v => v.id.toString() === id?.toString()) || allVendors[0];"
            new_code = code.replace(search_str, replacement.replace("const localVendors = JSON.parse(localStorage.getItem('newVendors')) || [];\n  const combinedVendors = [...allVendors, ...localVendors];\n  ", ""))
            
        with open(profile_path, "w", encoding="utf-8") as f:
            f.write(new_code)
        print("✅ تم مزامنة منتجات لوحة التحكم مع الملف الشخصي بنجاح!")
    else:
        print("ℹ️ المزامنة موجودة مسبقاً.")
else:
    print("⚠️ ملف VendorProfile.jsx غير موجود.")
