import os

path = os.path.expanduser("~/San3a/frontend/src/pages/VendorProfile.jsx")

if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # استبدال زر المراسلة بفراغ أو إزالته بالكامل
    target_button = """            <button className="w-full border-2 border-gray-100 dark:border-white/10 text-brand-dark dark:text-white py-3 rounded-lg font-bold hover:border-brand-gold hover:text-brand-gold transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4"/> {t('contact_vendor')}
            </button>"""

    if target_button in code:
        code = code.replace(target_button, "")
    else:
        # طريقة بديلة في حال اختلاف بسيط بالأحرف
        code = code.replace("{t('contact_vendor')}", "")
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم حذف خيار وزر المراسلة بنجاح!")
else:
    print("⚠️ الملف غير موجود.")
