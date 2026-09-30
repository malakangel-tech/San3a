import os

profile_path = os.path.expanduser("~/San3a/frontend/src/pages/VendorProfile.jsx")

if os.path.exists(profile_path):
    with open(profile_path, "r", encoding="utf-8") as f:
        code = f.read()

    # استبدال زر طلب تفصيل خاص ليصبح رابط (Link) موجه لصفحة التفصيل الخاص
    old_button = '<button className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-brand-gold transition-colors mb-3 flex items-center justify-center gap-2 shadow-lg">\n              {t(\'hire_me\')}\n            </button>'
    
    new_button = '''<Link to="/custom-order" className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-brand-gold transition-colors mb-3 flex items-center justify-center gap-2 shadow-lg">
              {isAr ? 'طلب تفصيل خاص' : 'Custom Order'}
            </Link>'''

    if old_button in code:
        code = code.replace(old_button, new_button)
    else:
        # استبدال عام في حال اختلاف المسافات
        code = code.replace('{t(\'hire_me\')}', '{isAr ? \'طلب تفصيل خاص\' : \'Custom Order\'}')
        # التأكد من استبدال الـ button بـ Link إذا كان موجوداً بشروط أخرى
        if '<Link to="/custom-order"' not in code:
            code = code.replace('className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold', 'to="/custom-order"\n              className="w-full block text-center bg-brand-dark text-white py-3 rounded-lg font-bold')

    with open(profile_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم ربط زر طلب تفصيل خاص بصفحة التصميم والطلب بنجاح!")
else:
    print("⚠️ ملف VendorProfile.jsx غير موجود.")
