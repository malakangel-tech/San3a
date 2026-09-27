import os
import re

directories = ["src/pages", "src/components"]

# قائمة الكلاسات الفاتحة وما يقابلها في الوضع الليلي
replacements = [
    (r'\bbg-white\b(?! dark:bg-\[#1E1E1E\])', 'bg-white dark:bg-[#1E1E1E]'),
    (r'\bbg-gray-50\b(?! dark:bg-\[#121212\])', 'bg-gray-50 dark:bg-[#121212]'),
    (r'\bborder-gray-100\b(?! dark:border-white\/10)', 'border-gray-100 dark:border-white/10'),
    (r'\bborder-gray-200\b(?! dark:border-white\/10)', 'border-gray-200 dark:border-white/10'),
    (r'\btext-brand-dark\b(?! dark:text-white)', 'text-brand-dark dark:text-white'),
    (r'\btext-gray-600\b(?! dark:text-gray-300)', 'text-gray-600 dark:text-gray-300'),
    (r'\btext-gray-500\b(?! dark:text-gray-400)', 'text-gray-500 dark:text-gray-400'),
    (r'\btext-gray-800\b(?! dark:text-gray-200)', 'text-gray-800 dark:text-gray-200'),
    (r'\bbg-\[#FDFCFB\]\b(?! dark:bg-\[#121212\])', 'bg-[#FDFCFB] dark:bg-[#121212]')
]

for d in directories:
    if os.path.exists(d):
        for filename in os.listdir(d):
            if filename.endswith(".jsx"):
                filepath = os.path.join(d, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        code = f.read()

                    new_code = code
                    for old, new in replacements:
                        new_code = re.sub(old, new, new_code)

                    if new_code != code:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_code)
                        print(f"✅ تم إضافة الوضع الليلي إلى: {filename}")
                except Exception as e:
                    print(f"⚠️ تخطي الملف {filename}: {e}")

print("🚀 اكتمل التحديث الشامل لجميع الصفحات!")
