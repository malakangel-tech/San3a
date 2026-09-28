import os

path = os.path.expanduser("~/San3a/frontend/src/App.jsx")
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

if "import VendorProfile from" not in code:
    code = code.replace("import Vendors from './pages/Vendors';", "import Vendors from './pages/Vendors';\nimport VendorProfile from './pages/VendorProfile';")
if '<Route path="/vendor/:id" element={<VendorProfile />} />' not in code:
    code = code.replace('<Route path="/vendors" element={<Vendors />} />', '<Route path="/vendors" element={<Vendors />} />\n          <Route path="/vendor/:id" element={<VendorProfile />} />')
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم إضافة مسار ملف النجار الشخصي إلى الموجه بنجاح!")
else:
    print("المسار موجود مسبقاً.")
