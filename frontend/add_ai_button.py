import os

path = os.path.expanduser("~/San3a/frontend/src/components/Navbar.jsx")

if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # إنشاء زر المساعد الذكي
    ai_link = '<Link to="/ai" className="hover:text-brand-gold transition-colors font-bold text-brand-gold flex items-center gap-1">✨ الذكاء الاصطناعي</Link>'
    
    # إضافته بجانب زر "تفصيل خاص" أو "النجارين"
    if 'to="/custom-order"' in code and 'to="/ai"' not in code:
        code = code.replace('<Link to="/custom-order"', ai_link + '\n          <Link to="/custom-order"')
    elif 'to="/vendors"' in code and 'to="/ai"' not in code:
        code = code.replace('<Link to="/vendors"', ai_link + '\n          <Link to="/vendors"')

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم إضافة زر 'الذكاء الاصطناعي' للشريط العلوي بنجاح!")
else:
    print("⚠️ ملف Navbar.jsx غير موجود.")
