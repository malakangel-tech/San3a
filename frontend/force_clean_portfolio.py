import os

path = "src/pages/VendorProfile.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # استبدال قسم النجار الأول بالكامل بنسخة نظيفة تحتوي فقط على صور أثاث
    old_block = """    { id: 1, name: isAr ? 'أحمد النجار' : 'Ahmed Al-Najjar', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 124, experience: '15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متخصص في صناعة الأثاث الكلاسيكي الفاخر بخبرة تمتد لـ 15 عاماً، أعتني بأدق التفاصيل والزخارف اليدوية.' : 'Master craftsman specializing in luxury classic furniture with 15 years of experience.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80'] }"""

    new_block = """    { id: 1, name: isAr ? 'أحمد النجار' : 'Ahmed Al-Najjar', specialty: t('specialty_classic'), rating: 5, verified: true, location: isAr ? 'البصرة' : 'Basra', projectsCount: 124, experience: '15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', cover: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1600&q=80', about: isAr ? 'حرفي متخصص في صناعة الأثاث الكلاسيكي الفاخر بخبرة تمتد لـ 15 عاماً، أعتني بأدق التفاصيل والزخارف اليدوية.' : 'Master craftsman specializing in luxury classic furniture with 15 years of experience.', portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80'] }"""

    if old_block in code:
        code = code.replace(old_block, new_block)
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم تنظيف معرض الأعمال بالكامل بنجاح!")
    else:
        print("⚠️ لم يتم مطابقة السطر بالضبط، جارٍ استخدام التبديل العام للرابط...")
        # إذا اختلف التنسيق، سنقوم بحذف رابط الصورة أينما وجد في الملف
        code = code.replace("'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80',", "")
        code = code.replace("'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80'", "")
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم إزالة الرابط من الملف نهائياً!")
else:
    print("❌ الملف غير موجود.")
