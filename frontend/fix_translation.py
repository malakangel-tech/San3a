import os
import re

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. إصلاح النصوص الموجودة داخل خصائص placeholder
    code = code.replace('placeholder="ادخل الرقم الرسمي للمستمسكات"', 'placeholder={isAr ? "ادخل الرقم الرسمي للمستمسكات" : "Enter official ID number"}')
    code = code.replace('placeholder="مثال: معرض النجاح للاثاث الفاخر"', 'placeholder={isAr ? "مثال: معرض النجاح للاثاث الفاخر" : "e.g., Al-Najah Luxury Furniture"}')

    # 2. إصلاح النصوص الحرة في واجهة المستخدم
    replacements = {
        "> توثيق الحساب<": ">{isAr ? ' توثيق الحساب' : ' Verify Account'}<",
        "توثيق الحساب (اشتراك $50 شهرياً)": "{isAr ? 'توثيق الحساب (اشتراك $50 شهرياً)' : 'Account Verification ($50/Month)'}",
        "مزايا باقة التوثيق الشهري ($50)": "{isAr ? 'مزايا باقة التوثيق الشهري ($50)' : 'Verification Badge Benefits ($50)'}",
        "شارة توثيق ومنحه أولوية عرض الورشة على الخريطة ورفع تقييمات هندسية": "{isAr ? 'شارة توثيق ومنحه أولوية عرض الورشة على الخريطة ورفع تقييمات هندسية' : 'Verified badge, priority map listing, and premium engineering reviews.'}",
        "رقم الهوية الرسمية / السجل التجاري": "{isAr ? 'رقم الهوية الرسمية / السجل التجاري' : 'Official ID / Commercial Record'}",
        "اسم الورشة أو الشركة الرسمي": "{isAr ? 'اسم الورشة أو الشركة الرسمي' : 'Official Workshop/Company Name'}",
        "انقر وارفع صور مستمسكات الهوية أو رخصة العمل وصور الورشة": "{isAr ? 'انقر وارفع صور مستمسكات الهوية أو رخصة العمل وصور الورشة' : 'Click to upload ID, work license, and workshop photos'}",
        "تفاصيل الدفع الالكتروني (اشتراك شهري: $50)": "{isAr ? 'تفاصيل الدفع الالكتروني (اشتراك شهري: $50)' : 'Payment Details ($50/Month)'}",
        "رقم البطاقة الائتمانية": "{isAr ? 'رقم البطاقة الائتمانية' : 'Credit Card Number'}",
        "تاريخ الانتهاء": "{isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}",
        "رمز الأمان (CVV)": "{isAr ? 'رمز الأمان (CVV)' : 'CVV Security Code'}",
        "دفع 50$ وتقديم طلب التوثيق": "{isAr ? 'دفع 50$ وتقديم طلب التوثيق' : 'Pay $50 & Submit Request'}"
    }

    for ar, en in replacements.items():
        # التأكد من عدم استبدال النص مرتين إذا تم تشغيل السكربت مسبقاً
        if en not in code:
            code = code.replace(ar, en)

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم تحويل نصوص التوثيق لدعم اللغتين العربية والإنجليزية بنجاح!")
else:
    print("❌ الملف غير موجود.")
