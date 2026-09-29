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
            
            if "صمم مساحتك" in content:
                found = True
                
                # إزالة أيقونة Sparkles (النجمة اللامعة) الشائعة في العناوين
                content = re.sub(r'<Sparkles[^>]*>', '', content)
                
                # إزالة الإيموجي إذا كان مستخدم (⭐ أو ✨)
                content = content.replace('⭐', '').replace('✨', '')
                
                # إزالة أيقونة Star تحديداً إذا كانت في نفس سطر "صمم مساحتك" أو السطر الذي قبله
                lines = content.split('\n')
                for i in range(len(lines)):
                    if "صمم مساحتك" in lines[i] or (i < len(lines)-1 and "صمم مساحتك" in lines[i+1]) or (i > 0 and "صمم مساحتك" in lines[i-1]):
                        lines[i] = re.sub(r'<Star[^>]*>', '', lines[i])
                        
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write('\n'.join(lines))
                print(f"✅ تم إزالة النجمة من قسم 'صمم مساحتك' في ملف {file} بنجاح!")

if not found:
    print("⚠️ لم يتم العثور على النص 'صمم مساحتك' في الملفات.")
