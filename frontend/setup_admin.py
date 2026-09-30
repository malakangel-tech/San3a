import os

path = "src/pages/Login.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. إضافة حالة الإيميل
    if "const [email, setEmail]" not in code:
        code = code.replace("const [showPassword, setShowPassword] = useState(false);", "const [showPassword, setShowPassword] = useState(false);\n  const [email, setEmail] = useState('');")

    # 2. إضافة دالة تسجيل الدخول الذكية
    handle_login_func = """
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@san3a.com' || email === 'admin') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', 'مدير النظام (ملاك)');
      localStorage.setItem('userEmail', 'admin@san3a.com');
      navigate('/dashboard');
    } else {
      const existingRole = localStorage.getItem('userRole');
      if(!existingRole) {
         localStorage.setItem('userRole', 'user');
         localStorage.setItem('userName', 'مستخدم');
      }
      localStorage.setItem('userEmail', email);
      navigate('/');
    }
  };
"""
    if "const handleLogin" not in code:
        code = code.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n" + handle_login_func)

    # 3. ربط الدالة بالنموذج وحقل الإدخال
    code = code.replace("onSubmit={(e) => { e.preventDefault(); navigate('/'); }}", "onSubmit={handleLogin}")
    code = code.replace('<input type="email" required className=', '<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className=')

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم تحديث نظام تسجيل الدخول وصلاحيات الأدمن!")
else:
    print("❌ الملف غير موجود.")
