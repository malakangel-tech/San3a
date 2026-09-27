import os

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # إضافة تبويب جديد لإدارة المستخدمين إذا لم يكن موجوداً
    if "activeTab === 'manage_users'" not in code:
        # 1. إضافة الزر للقائمة الجانبية للأدمن
        old_admin_btn = """{userRole === 'admin' && (
              <>
                <button onClick={() => setActiveTab('admin_stats')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'admin_stats' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> {t('admin_panel')}</div>
                </button>
                <button onClick={() => setActiveTab('commissions')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'commissions' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Percent className="w-4 h-4" /> {t('commission_dashboard')}</div>
                </button>
              </>
            )}"""

        new_admin_btn = """{userRole === 'admin' && (
              <>
                <button onClick={() => setActiveTab('admin_stats')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'admin_stats' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> {t('admin_panel')}</div>
                </button>
                <button onClick={() => setActiveTab('manage_users')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'manage_users' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> إدارة المستخدمين والنجارين</div>
                </button>
                <button onClick={() => setActiveTab('commissions')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'commissions' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Percent className="w-4 h-4" /> {t('commission_dashboard')}</div>
                </button>
              </>
            )}"""

        code = code.replace(old_admin_btn, new_admin_btn)

        # 2. إضافة محتوى الجدول الخاص بإدارة المستخدمين
        table_content = """
            {userRole === 'admin' && activeTab === 'manage_users' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">إدارة حسابات المستخدمين والنجارين والشركات</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400">
                        <th className="pb-3">الاسم</th>
                        <th className="pb-3">نوع الحساب</th>
                        <th className="pb-3">الحالة</th>
                        <th className="pb-3">إجراءات التحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      <tr>
                        <td className="py-3 font-bold text-brand-dark dark:text-white">أحمد النجار</td>
                        <td className="py-3 text-amber-600 font-semibold">نجار (Craftsman)</td>
                        <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">موثوق</span></td>
                        <td className="py-3">
                          <button onClick={() => alert('تم تعديل صلاحيات الحساب بنجاح')} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-100 mr-2">تعديل</button>
                          <button onClick={() => alert('تم حذف الحساب بنجاح')} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-100">حذف</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-brand-dark dark:text-white">ورشة الإبداع</td>
                        <td className="py-3 text-blue-600 font-semibold">شركة (Company)</td>
                        <td className="py-3"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">غير موثوق</span></td>
                        <td className="py-3">
                          <button onClick={() => alert('تم تعديل صلاحيات الحساب بنجاح')} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-100 mr-2">تعديل</button>
                          <button onClick={() => alert('تم حذف الحساب بنجاح')} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-100">حذف</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
"""
        # نضيف المحتوى قبل إغلاق قسم الـ admin_stats أو القسم الأخير
        code = code.replace("{userRole === 'admin' && activeTab === 'admin_stats' && (", table_content + "\n            {userRole === 'admin' && activeTab === 'admin_stats' && (")

        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم إضافة جدول إدارة المستخدمين بنجاح!")
    else:
        print("⚡ الجدول موجود مسبقاً.")
else:
    print("❌ الملف غير موجود.")
