                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('account_settings')}</h3>

                {saveSuccess && (
                  <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> {isAr ? 'تم حفظ التعديلات بنجاح!' : 'Settings saved successfully!'}
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{t('full_name')}</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رابط الصورة الشخصية' : 'Profile Picture URL'}</label>
                    <div className="relative">
                      <ImageIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={userImage}
                        onChange={(e) => setUserImage(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 pr-10 outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  {(userRole === 'craftsman' || userRole === 'company') && (
                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'نبذة عن الورشة / وصف الحرفي' : 'Craftsman / Workshop Bio'}</label>
                      <div className="relative">
                        <FileText className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <textarea
                          rows="3"
                          placeholder={isAr ? 'اكتب وصفاً مختصراً لخبرتك والأعمال التي تقدمها ورشتك...' : 'Describe your experience and specialty...'}
                          value={userBio}
                          onChange={(e) => setUserBio(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 pr-10 outline-none dark:text-white resize-none"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="bg-brand-dark dark:bg-brand-gold text-white font-bold px-6 py-3.5 rounded-xl uppercase tracking-wider hover:bg-brand-gold transition-colors shadow-md">
                    {t('save_changes')}
                  </button>
                </form>
              </div>
            )}

            {/* Admin Tabs & Verification Tabs */}
            {userRole === 'admin' && activeTab === 'admin_stats' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('admin_panel')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-900/30">
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">{t('total_users')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-purple-900 dark:text-purple-300">{totalUsersCount}</h4>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/30">
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{t('total_partners')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-indigo-900 dark:text-indigo-300">{partnersCount}</h4>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{t('total_sales')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-emerald-900 dark:text-emerald-300">$0</h4>
                  </div>
                </div>
              </div>
            )}

            {userRole === 'admin' && activeTab === 'manage_users' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'إدارة حسابات المستخدمين والنجارين والشركات' : 'Manage Users & Craftsmen'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400">
                        <th className="pb-3">{isAr ? 'الاسم' : 'Name'}</th>
                        <th className="pb-3">{isAr ? 'نوع الحساب' : 'Role'}</th>
                        <th className="pb-3">{isAr ? 'الحالة' : 'Status'}</th>
                        <th className="pb-3">{isAr ? 'إجراءات التحكم' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {usersList.map((usr) => (
                        <tr key={usr.id}>
                          <td className="py-3 font-bold text-brand-dark dark:text-white">{usr.name}</td>
                          <td className="py-3 text-amber-600 font-semibold">{usr.roleLabel}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${usr.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 dark:text-gray-300'}`}>
                              {usr.verified ? (isAr ? 'موثوق' : 'Verified') : (isAr ? 'غير موثوق' : 'Unverified')}
                            </span>
                          </td>
                          <td className="py-3 flex gap-2">
                            <button onClick={() => handleToggleVerify(usr.id)} className="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-1 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1">
                              <Edit3 className="w-3 h-3" /> {isAr ? 'تبديل التوثيق' : 'Toggle Status'}
                            </button>
                            <button onClick={() => handleDeleteUser(usr.id)} className="bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 px-3 py-1 rounded-lg font-bold hover:bg-red-100 flex items-center gap-1">
                              <Trash2 className="w-3 h-3" /> {isAr ? 'حذف' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'verification' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'توثيق الحساب (اشتراك 50$ شهرياً)' : 'Account Verification ($50/Month)'}
                </h3>
                {submissionSuccess ? (
                  <div className="bg-green-50 dark:bg-green-950/20 p-8 rounded-2xl border border-green-200 text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-300">{isAr ? 'تم تقديم الطلب والدفع بنجاح!' : 'Request Submitted Successfully!'}</h4>
                  </div>
                ) : (
                  <form onSubmit={handleFullVerificationSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رقم الهوية الرسمية / السجل التجاري' : 'Official ID / Commercial Record'}</label>
                      <input type="text" required placeholder={isAr ? 'أدخل الرقم الرسمي للمستمسك' : 'Enter official ID'} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'اسم الورشة أو الشركة الرسمي' : 'Official Workshop Name'}</label>
                      <input type="text" required placeholder={isAr ? 'مثال: معرض النخبة للأثاث الفاخر' : 'e.g., Elite Furniture'} value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none dark:text-white" />
                    </div>
                    <button type="submit" className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-brand-gold transition-colors shadow-lg">
                      {isAr ? 'دفع 50$ وتقديم طلب التوثيق' : 'Pay $50 & Submit Request'}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(full_dashboard_code)

print("✅ تم استكمال الكود وتحديث الملف بنجاح!")
