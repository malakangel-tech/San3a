import os
path = os.path.expanduser("~/San3a/frontend/src/App.jsx")
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace('path=\\"/ai\\"', 'path="/ai"')

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("✅ تم الإصلاح بنجاح!")
