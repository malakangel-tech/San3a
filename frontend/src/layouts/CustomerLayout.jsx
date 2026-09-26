import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { NotificationProvider, useNotifications } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X } from 'lucide-react';

// قائمة الإشعارات المنسدلة (Dropdown)
const NotificationDropdown = () => {
  const { notificationsOpen, setNotificationsOpen, notifications, markAllAsRead, unreadCount } = useNotifications();

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-32 w-80 bg-white dark:bg-[#1E1E1E] shadow-2xl rounded-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
              <div className="flex items-center gap-2 font-bold text-sm text-brand-dark dark:text-white">
                <Bell className="w-4 h-4 text-brand-gold" /> التنبيهات ({unreadCount})
              </div>
              <div className="flex items-center gap-2">
                <button onClick={markAllAsRead} className="text-[10px] text-brand-gold hover:underline flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5"/> قراءة الكل
                </button>
                <button onClick={() => setNotificationsOpen(false)} className="text-gray-400 hover:text-brand-dark dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className={`p-4 transition-colors ${n.unread ? 'bg-brand-gold/5 dark:bg-brand-gold/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-bold text-xs text-brand-dark dark:text-white">{n.title}</h5>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{n.desc}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-400">لا توجد تنبيهات جديدة</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const LayoutContent = ({ children }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-white' : 'bg-[#FDFCFB] text-brand-dark'}`}>
      <Navbar />
      <main className="flex-grow relative">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <NotificationDropdown />
    </div>
  );
};

const CustomerLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <CartProvider>
        <NotificationProvider>
          <LayoutContent>{children}</LayoutContent>
        </NotificationProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default CustomerLayout;
