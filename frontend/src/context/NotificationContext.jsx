import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'تحديث طلب التفصيل', desc: 'قام النجار أحمد بالمراجعة وتقديم العرض المبدئي.', time: 'منذ ساعتين', unread: true },
    { id: 2, title: 'حالة الشحن', desc: 'تم شحن طلبك رقم #SN-1084 بنجاح وهو في طريقه إليك.', time: 'أمس', unread: false }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notificationsOpen, setNotificationsOpen, notifications, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
