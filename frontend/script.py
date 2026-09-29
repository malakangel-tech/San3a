import os, re

register_path = "src/pages/Register.jsx"
vendors_path = "src/pages/Vendors.jsx"

# --- 1. Modify Register.jsx ---
if os.path.exists(register_path):
    with open(register_path, "r", encoding="utf-8") as f:
        reg_code = f.read()
    
    if "localStorage.setItem('newVendors'" not in reg_code and "localStorage.setItem(\"newVendors\"" not in reg_code:
        reg_code = re.sub(
            r"(navigate\([\'\"]/login[\'\"]\))", 
            r"if(formData.role === 'craftsman') { const newVendor = { id: Date.now(), name: formData.name, rating: 0, reviews: 0, completedJobs: 0, specialty: 'نجار عام', image: 'https://via.placeholder.com/150', portfolio: [] }; const existingVendors = JSON.parse(localStorage.getItem('newVendors')) || []; existingVendors.push(newVendor); localStorage.setItem('newVendors', JSON.stringify(existingVendors)); }\n      \1", 
            reg_code
        )
        with open(register_path, "w", encoding="utf-8") as f:
            f.write(reg_code)
        print("✅ تم تحديث Register.jsx لإضافة النجارين الجدد")
    else:
        print("⚡ الكود موجود مسبقاً في Register.jsx")
else:
    print("❌ ملف Register.jsx غير موجود")

# --- 2. Modify Vendors.jsx ---
if os.path.exists(vendors_path):
    with open(vendors_path, "r", encoding="utf-8") as f:
        ven_code = f.read()
    
    if "localVendors" not in ven_code:
        if "useState" not in ven_code:
            ven_code = ven_code.replace("import React", "import React, { useState, useEffect }")
        elif "useEffect" not in ven_code:
            ven_code = ven_code.replace("useState", "useState, useEffect")
            
        ven_code = re.sub(
            r"(const Vendors = \(\) => \{)",
            r"\1\n  const [localVendors, setLocalVendors] = useState([]);\n  useEffect(() => { const stored = JSON.parse(localStorage.getItem('newVendors')) || []; setLocalVendors(stored); }, []);\n",
            ven_code
        )
        
        ven_code = re.sub(
            r"(const filteredVendors = [^;]+;)",
            r"\1\n  const allFilteredVendors = [...filteredVendors, ...localVendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))];",
            ven_code
        )
        
        ven_code = ven_code.replace("filteredVendors.map", "allFilteredVendors.map")
        ven_code = ven_code.replace("filteredVendors.length", "allFilteredVendors.length")
        
        with open(vendors_path, "w", encoding="utf-8") as f:
            f.write(ven_code)
        print("✅ تم تحديث Vendors.jsx لعرض النجارين الجدد")
    else:
        print("⚡ الكود موجود مسبقاً في Vendors.jsx")
else:
    print("❌ ملف Vendors.jsx غير موجود")

