import os

target_url = "images.unsplash.com/photo-1540574163026-643ea20d25b5"

for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if target_url in content:
                # استبدال الرابط برابط صورة أثاث أخرى نظيفة
                new_content = content.replace(target_url, "images.unsplash.com/photo-1555041469-a586c61ea9bc")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"✅ تم إزالة الصورة من الملف: {file}")

print("🚀 تمت عملية التطهير الشامل!")
