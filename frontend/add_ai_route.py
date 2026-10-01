import os
import re

path = os.path.expanduser("~/San3a/frontend/src/App.jsx")

if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # إضافة سطر الاستيراد
    if "import AIAssistant" not in code:
        code = re.sub(r"(import .*?;)", r"\1\nimport AIAssistant from './pages/AIAssistant';", code, count=1)

    # إضافة مسار الصفحة
    if "path=\"/ai\"" not in code:
        code = re.sub(r"(<Routes>)", r"\1\n          <Route path=\"/ai\" element={<AIAssistant />} />", code)

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ تم إضافة صفحة المساعد الذكي (AI) إلى مسارات المشروع بنجاح!")
else:
    print("⚠️ ملف App.jsx غير موجود.")
