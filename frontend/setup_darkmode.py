import os

# 1. تحديث ThemeContext.jsx
theme_path = "src/context/ThemeContext.jsx"
if os.path.exists(theme_path):
    new_theme_code = """import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // جلب الحالة من التخزين المحلي عند التحميل
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
"""
    with open(theme_path, "w", encoding="utf-8") as f:
        f.write(new_theme_code)
    print("✅ تم تحديث ThemeContext.jsx بنجاح (مع حفظ الحالة)")

# 2. تفعيل darkMode في tailwind.config.js
tailwind_path = "tailwind.config.js"
if os.path.exists(tailwind_path):
    with open(tailwind_path, "r", encoding="utf-8") as f:
        tw_code = f.read()
    if "darkMode" not in tw_code:
        tw_code = tw_code.replace("export default {", "export default {\n  darkMode: 'class',")
        with open(tailwind_path, "w", encoding="utf-8") as f:
            f.write(tw_code)
        print("✅ تم تفعيل الوضع الليلي في ملف tailwind.config.js")

# 3. تحديث الألوان الجذرية في index.css
css_path = "src/index.css"
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        css_code = f.read()
    if "@layer base" not in css_code or ".dark body" not in css_code:
        append_css = """

@layer base {
  body {
    @apply bg-[#FDFCFB] text-[#1E1E1E] transition-colors duration-300;
  }
  .dark body {
    @apply bg-[#121212] text-[#FDFCFB];
  }
}
"""
        with open(css_path, "a", encoding="utf-8") as f:
            f.write(append_css)
        print("✅ تم ضبط ألوان الخلفيات والنصوص في ملف index.css")

