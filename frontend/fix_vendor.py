import os, re
path = "src/pages/Vendors.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()
    
    old_pattern = r"useEffect\(\(\) => \{ const stored = JSON\.parse\(localStorage\.getItem\(['\"]newVendors['\"]\)\) \|\| \[\]; setLocalVendors\(stored\); \}, \[\]\);"
    
    new_effect = """useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('newVendors')) || [];
    const currentRole = localStorage.getItem('userRole');
    const currentName = localStorage.getItem('userName');
    
    if ((currentRole === 'craftsman' || currentRole === 'company') && currentName) {
      if (!stored.some(v => v.name === currentName)) {
        stored.push({ id: Date.now(), name: currentName, rating: 5, verified: true, isVerified: true, specialty: 'نجار عام', location: 'البصرة', image: 'https://via.placeholder.com/150', portfolio: [] });
        localStorage.setItem('newVendors', JSON.stringify(stored));
      }
    }
    setLocalVendors(stored);
  }, []);"""
    
    if re.search(old_pattern, code):
        code = re.sub(old_pattern, new_effect, code)
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم ربط الحساب الحالي بقائمة النجارين بنجاح!")
    else:
        print("⚡ الكود تم تعديله مسبقاً أو لم يتم العثور عليه.")
else:
    print("❌ الملف غير موجود.")
