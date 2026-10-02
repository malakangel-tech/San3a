import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Clock, Settings, LogOut, CheckCircle, Shield, Wrench, Building2, UserCheck, BarChart3, PlusCircle, Award, Percent, Upload, CreditCard, Trash2, Edit3, ImageIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('workshop');
  const [customOrders, setCustomOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [userName, setUserName] = useState('Malak Mahdi');
  const [userEmail, setUserEmail] = useState('malak2006malak28@gmail.com');
  const [userImage, setUserImage] = useState('');
  const [userBio, setUserBio] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // بيانات التوثيق والدفع
  const [idNumber, setIdNumber] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // إدارة المستخدمين للأدمن
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'أحمد النجار', role: 'craftsman', roleLabel: 'نجار (Craftsman)', verified: true },
    { id: 2, name: 'ورشة الإبداع', role: 'company', roleLabel: 'شركة (Company)', verified: false },
    { id: 3, name: 'ملاك مهدي', role: 'user', roleLabel: 'مستخدم (User)', verified: false }
  ]);

   useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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

        // جلب الطلبات مع حماية الكود من الانهيار
        try {
          const ordersData = await apiFetch('/orders');
          setOrders(ordersData || []);
        } catch (err) {
          console.error('Failed to fetch orders:', err);
          setOrders([]);
        }

        // جلب الطلبات الخاصة
        try {
          const customOrdersData = await apiFetch('/custom-orders');
          setCustomOrders(customOrdersData || []);
        } catch (err) {
          console.error('Failed to fetch custom orders:', err);
          setCustomOrders([]);
        }

        // تصحيح قراءة البورتفوليو من التخزين المحلي بأمان
        const savedPortfolio = JSON.parse(localStorage.getItem('craftsmanPortfolio') || '[]');
        setPortfolioItems(savedPortfolio);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const updateOrderStatus = (id, newStatus) => {
    setWorkshopOrders(workshopOrders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleAddPortfolioItem = (e) => {
    e.preventDefault();
    if (!pieceTitle || !piecePrice || !pieceImage) return;

    const newItem = { id: Date.now(), title: pieceTitle, price: piecePrice, image: pieceImage };
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
    setSubmissionSuccess(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm(isAr ? 'هل أنت أُكيد من حذف هذا الحساب؟' : 'Are you sure?')) {
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-8 px-4 md:px-16">
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl text-center text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

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
                <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> {getRoleBadgeText()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>
            </div>
          </div>

          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100">
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar Tabs */}
          <div className="bg-white dark:bg-[#1E1E1E] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex lg:flex-col gap-2 overflow-x-auto">
            {(userRole === 'craftsman' || userRole === 'company') && (
              <>
                <button onClick={() => setActiveTab('workshop')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${activeTab === 'workshop' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>
                  <div className="flex items-center gap-2"><Wrench className="w-4 h-4" /> {t('manage_workshop')}</div>
                </button>
                <button onClick={() => setActiveTab('portfolio')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${activeTab === 'portfolio' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>
                  <div className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {isAr ? 'إضافة منتجات للمعرض' : 'Add Showcase Products'}</div>
                </button>
                <button onClick={() => setActiveTab('verification')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${activeTab === 'verification' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4" /> {isAr ? 'توثيق الحساب' : 'Verify Account'}</div>
                </button>
              </>
            )}

            <button onClick={() => setActiveTab('settings')} className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${activeTab === 'settings' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>
              <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> {t('account_settings')}</div>
            </button>
          </div>

          {/* Main Content Box */}
          <div className="lg:col-span-3 bg-white dark:bg-[#1E1E1E] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">

            {/* Workshop & Orders Tab */}
            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'workshop' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'إدارة الورشة والطلبات الواردة' : 'Manage Workshop & Incoming Orders'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <span className="text-xs text-amber-600 font-bold">{t('new_orders')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-amber-900 dark:text-amber-300">
                      {workshopOrders.filter(o => o.status === 'جديد').length}
                    </h4>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30">
                    <span className="text-xs text-blue-600 font-bold">{t('in_progress')}</span>
                    <h4 className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-300">
                      {workshopOrders.filter(o => o.status === 'قيد التنفيذ').length}
                    </h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
                    <span className="text-xs text-green-600 font-bold">{t('completed_projects')}</span>
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
                              <button onClick={() => updateOrderStatus(ord.id, 'جديد')} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-bold hover:bg-amber-100">
                                {isAr ? 'جديد' : 'New'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold hover:bg-blue-100">
                                {isAr ? 'قيد التنفيذ' : 'In Progress'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'مكتمل')} className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold hover:bg-green-100">
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

            {/* Add Portfolio Tab */}
            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'portfolio' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'إضافة منتج أو منشور جديد للمعرض' : 'Add New Showcase Product'}
                </h3>
                <form onSubmit={handleAddPortfolioItem} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'عنوان المنتج' : 'Product Title'}</label>
                    <input type="text" required placeholder="طاولة طعام كلاسيكية" value={pieceTitle} onChange={(e) => setPieceTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'السعر ($)' : 'Price ($)'}</label>
                    <input type="number" required placeholder="1200" value={piecePrice} onChange={(e) => setPiecePrice(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رابط الصورة' : 'Image URL'}</label>
                    <input type="url" required placeholder="https://images.unsplash.com/..." value={pieceImage} onChange={(e) => setPieceImage(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <button type="submit" className="bg-brand-dark dark:bg-brand-gold text-white font-bold px-6 py-3 rounded-xl uppercase">
                    {isAr ? 'نشر القطعة بالمعرض' : 'Publish Product'}
                  </button>
                </form>

                <div className="border-t border-gray-100 dark:border-white/10 pt-4">
                  <h4 className="font-bold text-brand-dark dark:text-white text-xs mb-3">{isAr ? 'منشورات أحدث أعمالك' : 'Your Items'} ({portfolioItems.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 p-2 flex gap-3 items-center">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h5 className="font-bold text-brand-dark dark:text-white text-xs">{item.title}</h5>
                          <p className="text-brand-gold font-bold text-xs">${item.price}</p>
                        </div>
                        <button onClick={() => handleDeletePortfolioItem(item.id)} className="text-red-500 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Verification Tab with Payment & 6 Hours Wait */}
            {(userRole === 'craftsman' || userRole === 'company') && activeTab === 'verification' && (
              <div className="space-y-6">
                <h3 className="font-bold text-brand-dark dark:text-white text-base md:text-lg border-b border-gray-100 dark:border-white/10 pb-4">
                  {isAr ? 'توثيق الحساب بالشارة الذهبية (اشتراك $50 شهرياً)' : 'Account Verification ($50/Month)'}
                </h3>

                {submissionSuccess ? (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-center space-y-4">
                    <Clock className="w-14 h-14 text-amber-600 mx-auto animate-pulse" />
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-300">
                      {isAr ? 'الطلب قيد المراجعة والتحقق من عملية الدفع' : 'Payment Verification In Progress'}
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto leading-relaxed">
                      {isAr 
                        ? 'تم استلام بيانات البطاقة والمستمسكات بنجاح. يستغرق التحقق من عملية الدفع وتفعيل الشارة الذهبية فترة تصل إلى 6 ساعات.' 
                        : 'Your details were received. Verification takes up to 6 hours.'}
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
                        <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رقم الهوية الرسمية / السجل التجاري' : 'Official ID'}</label>
                        <input type="text" required placeholder="أدخل الرقم الرسمي للمستمسك" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'اسم الورشة الرسمي' : 'Workshop Name'}</label>
                        <input type="text" required placeholder="معرض النخبة للأثاث الفاخر" value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
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

                    <button type="submit" className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl uppercase tracking-wider hover:bg-brand-gold shadow-lg flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{isAr ? 'تأكيد الدفع 50$ وإرسال للتحقق (6 ساعات)' : 'Pay $50 & Submit for Verification'}</span>
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
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{t('email')}</label>
                    <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'رابط الصورة الشخصية' : 'Profile Picture URL'}</label>
                    <input type="url" placeholder="https://example.com/avatar.jpg" value={userImage} onChange={(e) => setUserImage(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'نبذة عن الورشة / وصف الحرفي' : 'Bio'}</label>
                    <textarea rows="3" placeholder="وصف للورشة والخبرة..." value={userBio} onChange={(e) => setUserBio(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white resize-none"></textarea>
                  </div>
                  <button type="submit" className="bg-brand-dark dark:bg-brand-gold text-white font-bold px-6 py-3.5 rounded-xl uppercase">
                    {t('save_changes')}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
