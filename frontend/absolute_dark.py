import os

# 1. التأكد الجذري من إعدادات Tailwind
tw_path = "tailwind.config.js"
if os.path.exists(tw_path):
    with open(tw_path, "r", encoding="utf-8") as f:
        tw_code = f.read()
    if "darkMode: 'class'" not in tw_code and 'darkMode: "class"' not in tw_code:
        tw_code = tw_code.replace("export default {", "export default {\n  darkMode: 'class',")
        with open(tw_path, "w", encoding="utf-8") as f:
            f.write(tw_code)
        print("✅ تم تفعيل الوضع الليلي في الإعدادات.")

# 2. الاستبدال المباشر (بدون تعقيدات Regex) لضمان التعديل
dirs = ["src/pages", "src/components"]
for d in dirs:
    if os.path.exists(d):
        for file in os.listdir(d):
            if file.endswith(".jsx"):
                path = os.path.join(d, file)
                with open(path, "r", encoding="utf-8") as f:
                    code = f.read()
                
                # قائمة الألوان الفاتحة وما يقابلها في الليلي
                pairs = [
                    ("bg-white", "dark:bg-[#1E1E1E]"),
                    ("bg-[#FDFCFB]", "dark:bg-[#121212]"),
                    ("bg-gray-50", "dark:bg-[#121212]"),
                    ("border-gray-100", "dark:border-white/10"),
                    ("border-gray-200", "dark:border-white/10"),
                    ("text-brand-dark", "dark:text-white"),
                    ("text-gray-800", "dark:text-gray-200"),
                    ("text-gray-600", "dark:text-gray-300"),
                    ("text-gray-500", "dark:text-gray-400")
                ]
                
                for base, dark in pairs:
                    # إضافة اللون الليلي بجانب اللون الفاتح
                    code = code.replace(base, f"{base} {dark}")
                    # تنظيف التكرار في حال تم إضافته مرتين بالخطأ
                    code = code.replace(f"{base} {dark} {dark}", f"{base} {dark}")
                    # تنظيف إضافي لمسافات زائدة
                    code = code.replace(f"{base} {dark}  {dark}", f"{base} {dark}")

                with open(path, "w", encoding="utf-8") as f:
                    f.write(code)
                print(f"✅ تم تحديث {file}")

print("🚀 اكتمل التحديث الشامل بنجاح!")
