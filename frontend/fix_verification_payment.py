import os

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # قسم التوثيق والدفع الجديد الشامل مع حقول البطاقة والانتظار لمدة 6 ساعات
    new_verification_section = """            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'verification' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'توثيق الحساب بالشارة الذهبية (اشتراك $50 شهرياً)' : 'Account Verification ($50/Month)'}
                </h3>

                {submissionSuccess || verifiedStatus ? (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-center space-y-4">
                    <Clock className="w-14 h-14 text-amber-600 mx-auto animate-pulse" />
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-300">
                      {isAr ? 'الطلب قيد المراجعة والتحقق من عملية الدفع' : 'Payment Verification In Progress'}
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto leading-relaxed">
                      {isAr 
                        ? 'تم استلام بيانات البطاقة والمستمسكات بنجاح. يستغرق التحقق من عملية الدفع وتفعيل الشارة الذهبية فترة تصل إلى 6 ساعات.' 
                        : 'Your documents and card details were received. Verification and badge activation take up to 6 hours.'}
                    </p>
                    <div className="inline-block bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-bold px-4 py-2 rounded-full border border-amber-300">
                      ⏱ {isAr ? 'الوقت المتبقي المعين: 06:00:00 ساعة' : 'Estimated Time Remaining: 06:00:00 Hours'}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFullVerificationSubmit} className="space-y-4 text-xs max-w-lg">
                    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/10 space-y-3">
                      <h4 className="font-bold text-brand-dark dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-brand-gold" /> {isAr ? 'معلومات الهوية والورشة' : 'Identity & Workshop Info'}
                      </h4>
                      <div>
                        <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رقم الهوية الرسمية / السجل التجاري' : 'Official ID / Commercial Record'}</label>
                        <input type="text" required placeholder={isAr ? 'أدخل الرقم الرسمي للمستمسك' : 'Enter official ID'} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'اسم الورشة أو الشركة الرسمي' : 'Official Workshop Name'}</label>
                        <input type="text" required placeholder={isAr ? 'مثال: معرض النخبة للأثاث الفاخر' : 'e.g., Elite Furniture'} value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/10 space-y-3">
                      <h4 className="font-bold text-brand-dark dark:text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-gold" /> {isAr ? 'بيانات بطاقة الدفع (خصم $50)' : 'Card Payment Details ($50)'}
                      </h4>
                      <div>
                        <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رقم البطاقة المصرفية' : 'Card Number'}</label>
                        <input type="text" required maxLength="19" placeholder="4532 •••• •••• 8921" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                          <input type="text" required maxLength="5" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">CVV</label>
                          <input type="password" required maxLength="4" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl uppercase tracking-wider hover:bg-brand-gold transition-colors shadow-lg flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{isAr ? 'تأكيد الدفع 50$ وإرسال للتحقق (6 ساعات)' : 'Pay $50 & Submit for Verification'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}"""

    start_str = "{(userRole === 'craftsman' || userRole === 'company') && activeTab === 'verification' && ("
    if start_str in code:
        parts = code.split(start_str)
        after_parts = parts[1].split(")}", 1)
        code = parts[0] + new_verification_section + after_parts[1]
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم إضافة حقول الدفع البنكي ونظام الانتظار 6 ساعات بنجاح!")
    else:
        print("⚠️ لم يتم العثور على القسم بشكل مباشر، جارٍ التحديث الشامل...")
