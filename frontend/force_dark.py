import re, os

# 1. التأكد من تفعيل الوضع الليلي في إعدادات Tailwind
tw_path = "tailwind.config.js"
if os.path.exists(tw_path):
    with open(tw_path, 'r', encoding='utf-8') as f:
        tw = f.read()
    if "darkMode: 'class'" not in tw and 'darkMode: "class"' not in tw:
        tw = tw.replace("export default {", "export default {\n  darkMode: 'class',")
        with open(tw_path, 'w', encoding='utf-8') as f:
            f.write(tw)
        print("✅ تم تأكيد تفعيل الوضع الليلي في tailwind.config.js")

# 2. فرض كلاسات الوضع الليلي باستخدام Regex
def force_dark(filepath):
    if not os.path.exists(filepath):
        print(f"❌ لم يتم العثور على: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # إضافة كلاسات dark فقط إذا لم تكن موجودة بجانب الكلاس الأصلي
    c = re.sub(r'\bbg-white\b(?! dark:bg-\[#1E1E1E\])', 'bg-white dark:bg-[#1E1E1E]', c)
    c = re.sub(r'\bbg-gray-50\b(?! dark:bg-\[#121212\])', 'bg-gray-50 dark:bg-[#121212]', c)
    c = re.sub(r'\bborder-gray-100\b(?! dark:border-white\/10)', 'border-gray-100 dark:border-white/10', c)
    c = re.sub(r'\bborder-gray-200\b(?! dark:border-white\/10)', 'border-gray-200 dark:border-white/10', c)
    c = re.sub(r'\btext-brand-dark\b(?! dark:text-white)', 'text-brand-dark dark:text-white', c)
    c = re.sub(r'\btext-gray-600\b(?! dark:text-gray-300)', 'text-gray-600 dark:text-gray-300', c)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"✅ تم الفرض بنجاح على: {filepath}")

force_dark('src/pages/Vendors.jsx')
force_dark('src/components/VendorCard.jsx')
