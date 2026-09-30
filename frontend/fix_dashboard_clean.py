import os

path = "src/pages/Dashboard.jsx"

clean_code = """import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Clock, Settings, LogOut, CheckCircle, Shield, Wrench, Building2, UserCheck, BarChart3, PlusCircle, Award, Percent, Upload, CreditCard, Trash2, Edit3, ImageIcon, FileText } from 'lucide-react';
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
  const [userImage, setUserImage] = useState('');
  const [userBio, setUserBio] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // طلبات الورشة الواردة
  const [workshopOrders, setWorkshopOrders] = useState([
    { id: 101, customer: 'علي الحسين', type: 'طاولة طعام 8 كراسي', details: '200x100 سم / خشب زان', status: 'جديد' },
    { id: 102, customer: 'سارة أحمد', type: 'خزانة ملابس سحاب', details: '240x220 سم / خشب MDF اسباني', status: 'قيد التنفيذ' }
  ]);

  // منتجات المعرض
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [pieceTitle, setPieceTitle] = useState('');
  const [piecePrice, setPiecePrice] = useState('');
  const [pieceImage, setPieceImage] = useState('');

  // بيانات التوثيق
  const [idNumber, setIdNumber] = useState('');
  const [workshopName, setWorkshopName] = useState('');

  // إدارة المستخدمين للأدمن
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'أحمد النجار', role: 'craftsman', roleLabel: 'نجار (Craftsman)', verified: true },
    { id: 2, name: 'ورشة الإبداع', role: 'company', roleLabel: 'شركة (Company)', verified: false },
    { id: 3, name: 'ملاك مهدي', role: 'user', roleLabel: 'مستخدم (User)', verified: false }
  ]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
      setCustomOrders(savedOrders);

      const savedPortfolio = JSON.parse(localStorage.getItem('craftsmanPortfolio') || '[]');
      setPortfolioItems(savedPortfolio);

      const currentRole = localStorage.getItem('userRole');
      const currentName = localStorage.getItem('userName');
      const currentEmail = localStorage.getItem('userEmail');
      const currentImage = localStorage.getItem('userImage') || '';
      const currentBio = localStorage.getItem('userBio') || '';
      const isVerified = localStorage.getItem('isVerified') === 'true';

      if (currentRole) {
        setUserRole(currentRole);
        if (currentRole === 'user') setActiveTab('orders');
        else if (currentRole === 'admin') setActiveTab('admin_stats');
        else setActiveTab('workshop');
      }
      if (currentName) setUserName(currentName);
      if (currentEmail) setUserEmail(currentEmail);
      setUserImage(currentImage);
      setUserBio(currentBio);
      setVerifiedStatus(isVerified);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    setWorkshopOrders(workshopOrders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleAddPortfolioItem = (e) => {
    e.preventDefault();
    if (!pieceTitle || !piecePrice || !pieceImage) return;

    const newItem = {
      id: Date.now(),
      title: pieceTitle,
      price: piecePrice,
      image: pieceImage
    };

    const updatedPortfolio = [newItem, ...portfolioItems];
    setPortfolioItems(updatedPortfolio);
    localStorage.setItem('craftsmanPortfolio', JSON.stringify(updatedPortfolio));

    setPieceTitle('');
    setPiecePrice('');
    setPieceImage('');
  };

  const handleDeletePortfolioItem = (id) => {
    const updated = portfolioItems.filter(item => item.id !== id);
    setPortfolioItems(updated);
    localStorage.setItem('craftsmanPortfolio', JSON.stringify(updated));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userImage', userImage);
    localStorage.setItem('userBio', userBio);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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

  const totalUsersCount = usersList.length;
  const partnersCount = usersList.filter(u => u.role === 'craftsman' || u.role === 'company').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-8 px-4 md:px-16">
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Profile Header */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            {userImage ? (
              <img src={userImage} alt={userName} className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 text-brand-gold font-bold flex items-center justify-center text-xl">
                {userName.charAt(0)}
              </div>
            )}
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
                  <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {isAr ? 'إضافة منتجات للمعرض' : 'Add Showcase Products'}</div>
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

            {/* Craftsman Workshop Stats & Incoming Orders Tab */}
            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'workshop' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'إدارة الورشة والطلبات الواردة' : 'Manage Workshop & Incoming Orders'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">{t('new_orders')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-amber-900 dark:text-amber-300">
                      {workshopOrders.filter(o => o.status === 'جديد').length}
                    </h4>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{t('in_progress')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-300">
                      {workshopOrders.filter(o => o.status === 'قيد التنفيذ').length}
                    </h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">{t('completed_projects')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-green-900 dark:text-green-300">
                      {workshopOrders.filter(o => o.status === 'مكتمل').length}
                    </h4>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-bold text-brand-dark dark:text-white text-sm mb-4">
                    {isAr ? 'قائمة الطلبات التفصيلية الواردة للورشة' : 'Incoming Custom Orders'}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400">
                          <th className="pb-3">{isAr ? 'العميل' : 'Customer'}</th>
                          <th className="pb-3">{isAr ? 'نوع الطلب' : 'Item Type'}</th>
                          <th className="pb-3">{isAr ? 'المقاسات / الخشب' : 'Details'}</th>
                          <th className="pb-3">{isAr ? 'الحالة الحالية' : 'Status'}</th>
                          <th className="pb-3">{isAr ? 'التحكم بالحالة' : 'Change Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {workshopOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="py-3 font-bold text-brand-dark dark:text-white">{ord.customer}</td>
                            <td className="py-3 text-brand-gold font-semibold">{ord.type}</td>
                            <td className="py-3 text-gray-500 dark:text-gray-400">{ord.details}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'جديد' ? 'bg-amber-100 text-amber-800' :
                                ord.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3 flex gap-1">
                              <button onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-blue-100">
                                {isAr ? 'قيد التنفيذ' : 'In Progress'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'مكتمل')} className="bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-green-100">
                                {isAr ? 'إكتمال' : 'Complete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Craftsman Add Portfolio Tab */}
            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'portfolio' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4 mb-6">
                    {isAr ? 'إضافة منتج أو منشور جديد للمعرض' : 'Add New Showcase Product'}
                  </h3>
                  <form onSubmit={handleAddPortfolioItem} className="space-y-4 max-w-lg text-xs">
                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{isAr ? 'عنوان المنتج / القطعة' : 'Product Title'}</label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'مثال: طاولة طعام كلاسيكية خشب زان' : 'e.g., Classic Dining Table'}
                        value={pieceTitle}
                        onChange={(e) => setPieceTitle(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{isAr ? 'السعر ($)' : 'Price ($)'}</label>
                      <input
                        type="number"
                        required
                        placeholder="1200"
                                      value={piecePrice}
                        onChange={(e) => setPiecePrice(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1.5">{isAr ? 'رابط صورة العمل' : 'Image URL'}</label>
                      <div className="relative">
                        <ImageIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={pieceImage}
                          onChange={(e) => setPieceImage(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 pr-10 outline-none dark:text-white"
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-brand-dark dark:bg-brand-gold text-white font-bold px-6 py-3.5 rounded-xl uppercase tracking-wider hover:bg-brand-gold transition-colors shadow-md">
                      {isAr ? 'نشر القطعة بالمعرض' : 'Publish Product'}
                    </button>
                  </form>
                </div>

                <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                  <h4 className="font-bold text-brand-dark dark:text-white text-sm mb-4">
                    {isAr ? 'منشورات أحدث أعمالك المضافة' : 'Your Added Showcase Items'} ({portfolioItems.length})
                  </h4>
                  {portfolioItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {portfolioItems.map((item) => (
                        <div key={item.id} className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex gap-3 p-3 items-center">
                          <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h5 className="font-bold text-brand-dark dark:text-white text-xs">{item.title}</h5>
                            <p className="text-brand-gold font-bold text-xs mt-1">${item.price}</p>
                          </div>
                          <button onClick={() => handleDeletePortfolioItem(item.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">{isAr ? 'لم تقم بإضافة أي منتجات معرض بعد.' : 'No items added yet.'}</p>
                  )}
                </div>
              </div>
            )}

            {/* Verification Tab */}
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

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
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

            {/* Admin Stats */}
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

            {/* Admin Manage Users */}
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
