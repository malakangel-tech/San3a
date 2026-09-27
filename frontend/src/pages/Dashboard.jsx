import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Clock, Settings, LogOut, CheckCircle, Shield, Wrench, Building2, UserCheck, BarChart3, PlusCircle, Award, Percent, Upload, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('workshop');
  const [customOrders, setCustomOrders] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [userName, setUserName] = useState('Malak Mahdi');
  const [userEmail, setUserEmail] = useState('malak2006malak28@gmail.com');
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [idNumber, setIdNumber] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
      setCustomOrders(savedOrders);
      
      const currentRole = localStorage.getItem('userRole');
      const currentName = localStorage.getItem('userName');
      const currentEmail = localStorage.getItem('userEmail');
      const isVerified = localStorage.getItem('isVerified') === 'true';

      if (currentRole) {
        setUserRole(currentRole);
        if (currentRole === 'user') setActiveTab('orders');
        else if (currentRole === 'admin') setActiveTab('admin_stats');
        else setActiveTab('workshop');
      }
      if (currentName) setUserName(currentName);
      if (currentEmail) setUserEmail(currentEmail);
      setVerifiedStatus(isVerified);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleFullVerificationSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('isVerified', 'true');
    setVerifiedStatus(true);
    setSubmissionSuccess(true);
  };

  const getRoleBadgeText = () => {
    if (userRole === 'craftsman') return t('role_label_craftsman');
    if (userRole === 'company') return t('role_label_company');
    if (userRole === 'admin') return t('role_label_admin');
    return t('role_label_user');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-8 px-4 md:px-16">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-dark dark:text-white">{t('dashboard_title')}: {userName}</h1>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                userRole === 'craftsman' ? 'bg-amber-100 text-amber-800' :
                userRole === 'company' ? 'bg-blue-100 text-blue-800' :
                userRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                {userRole === 'craftsman' && <Wrench className="w-3 h-3" />}
                {userRole === 'company' && <Building2 className="w-3 h-3" />}
                {userRole === 'admin' && <Shield className="w-3 h-3" />}
                {userRole === 'user' && <UserCheck className="w-3 h-3" />}
                {getRoleBadgeText()}
              </span>
              {verifiedStatus && (
                <span className="bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>
          </div>

          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="bg-white dark:bg-[#1E1E1E] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex lg:flex-col gap-2 overflow-x-auto">
            
            {userRole === 'user' && (
              <>
                <button onClick={() => setActiveTab('orders')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><Package className="w-4 h-4" /> {t('my_orders')}</div>
                </button>
                <button onClick={() => setActiveTab('custom')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'custom' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {t('custom_requests')}</div>
                  <span className="bg-white dark:bg-[#1E1E1E]/20 px-2 py-0.5 rounded-full text-[10px]">{customOrders.length}</span>
                </button>
              </>
            )}

            {(userRole === 'craftsman' || userRole === 'company') && (
              <>
                <button onClick={() => setActiveTab('workshop')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'workshop' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><Wrench className="w-4 h-4" /> {t('manage_workshop')}</div>
                </button>
                <button onClick={() => setActiveTab('portfolio')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'portfolio' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {t('add_portfolio_item')}</div>
                </button>
                <button onClick={() => setActiveTab('verification')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'verification' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4" />{isAr ? ' توثيق الحساب' : ' Verify Account'}</div>
                </button>
              </>
            )}

            {userRole === 'admin' && (
              <>
                <button onClick={() => setActiveTab('admin_stats')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'admin_stats' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> {t('admin_panel')}</div>
                </button>
                <button onClick={() => setActiveTab('manage_users')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'manage_users' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> إدارة المستخدمين والنجارين</div>
                </button>
                <button onClick={() => setActiveTab('commissions')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'commissions' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
                  <div className="flex items-center gap-2"><Percent className="w-4 h-4" /> {t('commission_dashboard')}</div>
                </button>
              </>
            )}

            <button onClick={() => setActiveTab('settings')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#121212] dark:hover:bg-white dark:bg-[#1E1E1E]/5'}`}>
              <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> {t('account_settings')}</div>
            </button>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-[#1E1E1E] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
            
            {userRole === 'user' && activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('my_orders')}</h3>
                <p className="text-xs text-gray-400 py-8 text-center">{t('no_orders_yet')}</p>
              </div>
            )}

            {userRole === 'user' && activeTab === 'custom' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('custom_requests')}</h3>
                {customOrders.length > 0 ? (
                  <div className="space-y-4">
                    {customOrders.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-[#121212] dark:bg-black/20 p-4 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-brand-dark dark:text-white">{item.id} - {item.type}</span>
                        <span className="text-green-600 font-bold">{item.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs space-y-2">
                    <p>{t('no_custom_yet')}</p>
                    <button onClick={() => navigate('/custom')} className="text-brand-gold font-bold underline">{t('start_custom_btn')}</button>
                  </div>
                )}
              </div>
            )}

            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'workshop' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('workshop_stats')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <span className="text-xs text-amber-600 font-bold">{t('new_orders')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-amber-900 dark:text-amber-300">0</h4>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30">
                    <span className="text-xs text-blue-600 font-bold">{t('in_progress')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-300">0</h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
                    <span className="text-xs text-green-600 font-bold">{t('completed_projects')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-green-900 dark:text-green-300">0</h4>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">{t('stats_note')}</p>
              </div>
            )}

            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'portfolio' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('add_portfolio_item')}</h3>
                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('piece_title')}</label>
                    <input type="text" placeholder={t('piece_placeholder')} className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('price_label')}</label>
                    <input type="number" placeholder="1200" className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <button className="bg-brand-dark dark:bg-brand-gold text-white font-bold px-6 py-3 rounded-xl uppercase tracking-wider">{t('publish_btn')}</button>
                </div>
              </div>
            )}

            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'verification' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{isAr ? 'توثيق الحساب (اشتراك 50$ شهرياً)' : 'Account Verification ($50/Month)'}</h3>
                
                {submissionSuccess ? (
                  <div className="bg-green-50 dark:bg-green-950/20 p-8 rounded-2xl border border-green-200 text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-300">تم تقديم الطلب والدفع بنجاح!</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                      تم استلام مستمسكاتك وعملية الدفع بقيمة 50$ بنجاح. يرجى الانتظار لمدة <strong>ست ساعات</strong> ريثما يتم مراجعة المستمسكات من قبل الإدارة وسيتم توثيق الحساب وتفعيل الشارة الذهبية تلقائياً.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFullVerificationSubmit} className="space-y-4 text-xs">
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 text-amber-800 dark:text-amber-300 space-y-1">
                      <p className="font-bold">{isAr ? 'مزايا باقة التوثيق الشهري (50$):' : 'Verification Badge Benefits ($50):'}</p>
                      <p className="text-[11px]">{isAr ? 'شارة توثيق رسمية، أولوية عرض الورشة على الخريطة، وإدارة مبيعات متقدمة.' : 'Official verified badge, priority map listing, and advanced sales management.'}</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رقم الهوية الرسمية / السجل التجاري' : 'Official ID / Commercial Record'}</label>
                      <input 
                        type="text" 
                        required
                        placeholder={isAr ? "أدخل الرقم الرسمي للمستمسك" : "Enter official ID number"}
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'اسم الورشة أو الشركة الرسمي' : 'Official Workshop/Company Name'}</label>
                      <input 
                        type="text" 
                        required
                        placeholder={isAr ? "مثال: معرض النخبة للأثاث الفاخر" : "e.g., Elite Luxury Furniture"}
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none dark:text-white"
                      />
                    </div>

                    <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-brand-gold transition-colors">
                      <Upload className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{isAr ? 'اختر وارفع صور مستمسكات الهوية أو رخصة العمل وصور الورشة' : 'Click to upload ID, work license, and workshop photos'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#121212] dark:bg-black/20 p-5 rounded-2xl space-y-4 border border-gray-100 dark:border-white/10 dark:border-white/5">
                      <div className="flex items-center gap-2 font-bold text-brand-dark dark:text-white">
                        <CreditCard className="w-5 h-5 text-brand-gold" /> {isAr ? 'تفاصيل الدفع الإلكتروني (اشتراك شهري: 50$)' : 'Electronic Payment Details ($50/month)'}
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'رقم البطاقة الائتمانية' : 'Credit Card Number'}</label>
                        <input 
                          type="text" 
                          required
                          placeholder="4532 •••• •••• 8921" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white dark:bg-[#1E1E1E] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                          <input 
                            type="text" 
                            required
                            placeholder="MM/YY" 
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full bg-white dark:bg-[#1E1E1E] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'رمز الأمان (CVV)' : 'CVV Security Code'}</label>
                          <input 
                            type="password" 
                            required
                            maxLength="4"
                            placeholder="123" 
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full bg-white dark:bg-[#1E1E1E] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" 
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-4 rounded-xl uppercase tracking-wider hover:bg-brand-gold transition-colors shadow-lg">
                                  {isAr ? 'دفع 50$ وتقديم طلب التوثيق' : 'Pay $50 & Submit Request'}
                </button>
              </form>
            )}
          </div>
        )}
            
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
                        <td className="py-3"><span className="bg-gray-100 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px]">غير موثوق</span></td>
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

            {userRole === 'admin' && activeTab === 'admin_stats' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('admin_panel')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-900/30">
                    <span className="text-xs text-purple-600 font-bold">{t('total_users')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-purple-900 dark:text-purple-300">1</h4>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/30">
                    <span className="text-xs text-indigo-600 font-bold">{t('total_partners')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-indigo-900 dark:text-indigo-300">0</h4>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                    <span className="text-xs text-emerald-600 font-bold">{t('total_sales')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-emerald-900 dark:text-emerald-300">$0</h4>
                  </div>
                </div>
              </div>
            )}

            {userRole === 'admin' && activeTab === 'commissions' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('commission_dashboard')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-brand-gold/10 p-5 rounded-xl border border-brand-gold/20 space-y-2">
                    <span className="font-bold text-brand-gold uppercase">{t('platform_commission_rate')}</span>
                    <h4 className="text-xl font-bold text-brand-dark dark:text-white">10%</h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-5 rounded-xl border border-green-200 dark:border-green-900/30 space-y-2">
                    <span className="font-bold text-green-600 uppercase">{t('total_commissions_earned')}</span>
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-300">$0</h4>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('account_settings')}</h3>
                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('full_name')}</label>
                    <input type="text" defaultValue={userName} className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('email')}</label>
                    <input type="text" defaultValue={userEmail} className="w-full bg-gray-50 dark:bg-[#121212] dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <button className="bg-brand-dark dark:bg-brand-gold text-white font-bold px-6 py-3 rounded-xl uppercase tracking-wider">{t('save_changes')}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
