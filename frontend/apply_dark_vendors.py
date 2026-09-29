import os

def apply_dark_mode(filepath):
    if not os.path.exists(filepath):
        print(f"❌ ملف {filepath} غير موجود.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # قاموس الاستبدالات لإضافة الوضع الليلي بدقة
    replacements = {
        'bg-white': 'bg-white dark:bg-[#1E1E1E]',
        'border-gray-100': 'border-gray-100 dark:border-white/10',
        'bg-gray-50': 'bg-gray-50 dark:bg-[#121212]',
        'border-gray-200': 'border-gray-200 dark:border-white/10',
        'text-brand-dark': 'text-brand-dark dark:text-white',
        'text-gray-600': 'text-gray-600 dark:text-gray-300',
        'text-gray-500': 'text-gray-500 dark:text-gray-400',
        'text-gray-400': 'text-gray-400 dark:text-gray-500'
    }

    for old, new in replacements.items():
        # التأكد من عدم تكرار الكلاسات إذا كانت مضافة مسبقاً
        if new not in code:
            # استبدال ذكي يتجنب تكرار الكلاس
            code = code.replace(old, new).replace(new + " dark:bg-[#1E1E1E]", new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"✅ تم تفعيل الوضع الليلي في: {filepath}")

# تطبيق التعديلات على صفحة النجارين ومكون البطاقة
apply_dark_mode('src/pages/Vendors.jsx')
apply_dark_mode('src/components/VendorCard.jsx')
