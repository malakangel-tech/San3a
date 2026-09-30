import os

path = "src/pages/Dashboard.jsx"

full_dashboard_code = """import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Clock, Settings, LogOut, CheckCircle, Shield, Wrench, Building2, UserCheck, BarChart3, PlusCircle, Award, Percent, Upload, CreditCard, Trash2, Edit3 } from 'lucide-react';
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

  // إدارة المستخدمين التفاعلية للأدمن
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'أحمد النجار', role: 'craftsman', roleLabel: 'نجار (Craftsman)', verified: true },
    { id: 2, name: 'ورشة الإبداع', role: 'company', roleLabel: 'شركة (Company)', verified: false },
    { id: 3, name: 'ملاك مهدي', role: 'user', roleLabel: 'مستخدم (User)', verified: false }
  ]);

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

  const handleDeleteUser = (id) => {
    if (window.confirm(isAr ? 'هل أنت أُكيد من حذف هذا الحساب؟' : 'Are you sure you want to delete this account?')) {
      setUsersList(usersList.filter(user => user.id !== id));
    }
  };

  const handleToggleVerify = (id) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, verified: !u.verified } : u));
  };

  const getRoleBadgeText = () => {
    if (userRole === 'craftsman') return t('role_label_craftsman');
    if (userRole === 'company') return t('role_label_company');
    if (userRole === 'admin') return t('role_label_admin');
    return t('role_label_user');
  };

  // حساب الأعداد الديناميكية للإحصائيات
  const totalUsersCount = usersList.length;
  const partnersCount = usersList.filter(u => u.role === 'craftsman' || u.role === 'company').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-8 px-4 md:px-16">
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Profile Card Header */}
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
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>
          </div>

          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar Tabs */}
          <div className="bg-white dark:bg-[#1E1E1E] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex lg:flex-col gap-2 overflow-x-auto">
            {userRole === 'user' && (
              <>
                <button onClick={() => setActiveTab('orders')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Package className="w-4 h-4" /> {t('my_orders')}</div>
                </button>
                <button onClick={() => setActiveTab('custom')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'custom' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {t('custom_requests')}</div>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{customOrders.length}</span>
                </button>
              </>
            )}

            {(userRole === 'craftsman' || userRole === 'company') && (
              <>
                <button onClick={() => setActiveTab('workshop')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'workshop' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Wrench className="w-4 h-4" /> {t('manage_workshop')}</div>
                </button>
                <button onClick={() => setActiveTab('portfolio')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'portfolio' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {t('add_portfolio_item')}</div>
                </button>
                <button onClick={() => setActiveTab('verification')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'verification' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4" /> {isAr ? 'توثيق الحساب' : 'Verify Account'}</div>
                </button>
              </>
            )}

            {userRole === 'admin' && (
              <>
                <button onClick={() => setActiveTab('admin_stats')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'admin_stats' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> {t('admin_panel')}</div>
                </button>
                <button onClick={() => setActiveTab('manage_users')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'manage_users' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> {isAr ? 'إدارة المستخدمين والنجارين' : 'Manage Users'}</div>
                </button>
                <button onClick={() => setActiveTab('commissions')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'commissions' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2"><Percent className="w-4 h-4" /> {t('commission_dashboard')}</div>
                </button>
              </>
            )}

            <button onClick={() => setActiveTab('settings')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
              <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> {t('account_settings')}</div>
            </button>
          </div>

          {/* Main Content Box */}
          <div className="lg:col-span-3 bg-white dark:bg-[#1E1E1E] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">

            {/* Admin Stats Tab */}
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

            {/* Manage Users Tab */}
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

            {/* Commissions Tab */}
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

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">{t('account_settings')}</h3>
                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('full_name')}</label>
                    <input type="text" defaultValue={userName} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('email')}</label>
                    <input type="text" defaultValue={userEmail} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
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
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(full_dashboard_code)

print("✅ تم تحويل لوحة الأدمن والإحصائيات وأزرار الحذف والتعديل إلى نظام تفاعلي 100%!")
