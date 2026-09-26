import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Package, Hammer, User, LogOut, Clock, CheckCircle2, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');

  // بيانات وهمية للطلبات
  const orders = [
    { id: '#SN-1084', date: '2026-06-12', total: 850, status: 'processing', items: 'Modern Velvet Sofa' },
    { id: '#SN-1052', date: '2026-05-28', total: 420, status: 'delivered', items: 'Wooden Table' }
  ];

  // بيانات وهمية لطلبات التفصيل
  const customRequests = [
    { id: '#CR-301', name: 'طاولة طعام دائرية خشب زان', date: '2026-06-15', status: 'shipping', vendor: 'أحمد النجار' }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'processing':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> {t('status_processing')}</span>;
      case 'shipping':
        return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> {t('status_shipping')}</span>;
      case 'delivered':
        return <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> {t('status_delivered')}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* هيدر الملف الشخصي */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-2xl font-bold border-2 border-brand-gold/30">
              م
            </div>
            <div>
              <h1 className={`text-2xl font-bold text-brand-dark mb-1 ${isAr ? '' : 'font-serif'}`}>ملاك مهدي محسن</h1>
              <p className="text-gray-500 text-sm">malak2006malak28@gmail.com</p>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 border border-gray-200 text-red-500 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </motion.div>

        {/* التبويبات والمحتوى */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* القائمة الجانبية للتبويبات */}
          <div className="md:col-span-1 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-brand-dark text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
            >
              <Package className="w-4 h-4" /> {t('my_orders')}
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'custom' ? 'bg-brand-dark text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
            >
              <Hammer className="w-4 h-4" /> {t('custom_requests')}
            </button>
          </div>

          {/* محتوى الجدول بناءً على التبويب */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className={`text-xl font-bold text-brand-dark mb-6 ${isAr ? '' : 'font-serif'}`}>{t('my_orders')}</h2>
                  <div className="space-y-4">
                    {orders.map((order, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-gray-50 border border-gray-100 gap-4">
                        <div>
                          <span className="font-bold text-brand-dark text-sm">{order.id}</span>
                          <p className="text-gray-500 text-xs mt-1">{order.items} • {order.date}</p>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="font-bold text-brand-gold">${order.total}</span>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'custom' && (
                <div>
                  <h2 className={`text-xl font-bold text-brand-dark mb-6 ${isAr ? '' : 'font-serif'}`}>{t('custom_requests')}</h2>
                  <div className="space-y-4">
                    {customRequests.map((req, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-gray-50 border border-gray-100 gap-4">
                        <div>
                          <span className="font-bold text-brand-dark text-sm">{req.id} - {req.name}</span>
                          <p className="text-gray-500 text-xs mt-1">النجار: {req.vendor} • {req.date}</p>
                        </div>
                        <div>
                          {getStatusBadge(req.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
