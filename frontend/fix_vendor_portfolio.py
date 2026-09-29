import os

path = "src/pages/VendorProfile.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # استبدال كامل سطر الـ portfolio للنجار الأول بقائمة خالية تماماً من صورة الشاب
    old_portfolio = "portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80']"
    
    new_portfolio = "portfolio: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80']"

    if old_portfolio in code:
        code = code.replace(old_portfolio, new_portfolio)
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم حذف الصورة نهائياً بنجاح!")
    else:
        print("⚠️ لم يتم العثور على السطر بالطابق الدقيق، سيتم فرض التحديث.")
        # حل بديل إذا كان النص مختلفاً قليلاً
        code = code.replace(", 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=600&q=80'", "")
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم الحذف بالطريقة البديلة!")
else:
    print("❌ الملف غير موجود.")
