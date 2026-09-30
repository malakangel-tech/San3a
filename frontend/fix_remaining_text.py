import os

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    replacements = {
        ">توثيق الحساب (اشتراك 50$ شهرياً)<": ">{isAr ? 'توثيق الحساب (اشتراك 50$ شهرياً)' : 'Account Verification ($50/Month)'}<",
        ">مزايا باقة التوثيق الشهري (50$):<": ">{isAr ? 'مزايا باقة التوثيق الشهري (50$):' : 'Verification Badge Benefits ($50):'}<",
        ">شارة توثيق رسمية، أولوية عرض الورشة على الخريطة، وإدارة مبيعات متقدمة.<": ">{isAr ? 'شارة توثيق رسمية، أولوية عرض الورشة على الخريطة، وإدارة مبيعات متقدمة.' : 'Official verified badge, priority map listing, and advanced sales management.'}<",
        'placeholder="أدخل الرقم الرسمي للمستمسك"': 'placeholder={isAr ? "أدخل الرقم الرسمي للمستمسك" : "Enter official ID number"}',
        'placeholder="مثال: معرض النخبة للأثاث الفاخر"': 'placeholder={isAr ? "مثال: معرض النخبة للأثاث الفاخر" : "e.g., Elite Luxury Furniture"}',
        ">اختر وارفع صور مستمسكات الهوية أو رخصة العمل وصور الورشة<": ">{isAr ? 'اختر وارفع صور مستمسكات الهوية أو رخصة العمل وصور الورشة' : 'Click to upload ID, work license, and workshop photos'}<",
        "تفاصيل الدفع الإلكتروني (اشتراك شهري: 50$)": "{isAr ? 'تفاصيل الدفع الإلكتروني (اشتراك شهري: 50$)' : 'Electronic Payment Details ($50/month)'}"
    }

    for ar, en in replacements.items():
        if en not in code:
            code = code.replace(ar, en)

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم ترجمة جميع النصوص المتبقية بنجاح!")
else:
    print("❌ الملف غير موجود.")
