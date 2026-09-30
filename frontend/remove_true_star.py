import os
import re

src_dir = os.path.expanduser("~/San3a/frontend/src")

found = False
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # نبحث عن الملف الفعلي الذي يرسم واجهة "صمم مساحتك"
            if "hero_title" in content or "hero_tag" in content:
                found = True
                
                # نحذف أيقونة النجمة أو اللمعة برمجياً
                new_content = re.sub(r'<Sparkles[^>]*>', '', content)
                new_content = re.sub(r'<Star[^>]*>', '', new_content)
                
                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"✅ تم صيد النجمة وحذفها من ملف التصميم ({file}) بنجاح!")
                else:
                    print(f"ℹ️ تم العثور على القسم في {file} ولكن الأيقونة محذوفة مسبقاً.")

if not found:
    print("⚠️ لم يتم العثور على مكون الواجهة.")
