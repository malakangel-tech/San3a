import re, os

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # البحث عن الزر الفارغ أو الناقص واستبداله بالزر الكامل
    pattern = r"<button onClick=\{\(\) => setActiveTab\('verification'\)\}.*?</button>"
    replacement = """<button onClick={() => setActiveTab('verification')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'verification' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4" /> توثيق الحساب</div>
                </button>"""
    
    new_code = re.sub(pattern, replacement, code, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_code)
    print("✅ تم استرجاع زر توثيق الحساب بنجاح!")
else:
    print("❌ الملف غير موجود.")
