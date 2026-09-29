import os
import re

profile_path = os.path.expanduser("~/San3a/frontend/src/pages/VendorProfile.jsx")

if os.path.exists(profile_path):
    with open(profile_path, "r", encoding="utf-8") as f:
        code = f.read()

    # تحديث سطر البحث ليقرأ الحسابات الجديدة المحفوظة في الذاكرة (مثل حساب ملاك)
    pattern = r"const vendor = allVendors\.find[^\n]+"
    replacement = """const localVendors = JSON.parse(localStorage.getItem('newVendors')) || [];
  const combinedVendors = [...allVendors, ...localVendors];
  const vendor = combinedVendors.find(v => v.id.toString() === id?.toString()) || allVendors[0];"""

    if "combinedVendors.find" not in code:
        new_code = re.sub(pattern, replacement, code)
        with open(profile_path, "w", encoding="utf-8") as f:
            f.write(new_code)
        print("✅ تم تحديث صفحة البروفايل لتتعرف على حساب ملاك والحسابات الجديدة بنجاح!")
    else:
        print("ℹ️ صفحة البروفايل محدثة مسبقاً.")
else:
    print("⚠️ ملف VendorProfile.jsx غير موجود.")

# تحديث الموجه في حال كان الرابط قديماً
app_path = os.path.expanduser("~/San3a/frontend/src/App.jsx")
if os.path.exists(app_path):
    with open(app_path, "r", encoding="utf-8") as f:
        app_code = f.read()
    
    if 'path="/vendor-profile"' in app_code:
        app_code = app_code.replace('path="/vendor-profile"', 'path="/vendor/:id"')
        with open(app_path, "w", encoding="utf-8") as f:
            f.write(app_code)
        print("✅ تم تصحيح مسار الراوتر (Router) لدعم الـ ID الخاص بكل نجار!")
