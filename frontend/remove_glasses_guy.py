import os

path = "src/pages/VendorProfile.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # استبدال سطر مجموعة الأعمال للنجار الأول (أحمد النجار) بدون صورة الشاب بالنظارات
    old_line = "'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80', "
    if old_line in code:
        code = code.replace(old_line, "")
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم حذف صورة الشاب من معرض أعمال النجار بنجاح!")
    else:
        print("⚡ الصورة محذوفة مسبقاً أو غير موجودة بهذا الرابط.")
else:
    print("❌ الملف غير موجود.")
