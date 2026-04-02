import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const NotificationsView = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/v1/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const clearAll = async () => {
    try {
      await fetch('/api/v1/notifications/all', { method: 'DELETE' });
      setNotifications([]);
    } catch (error) {
      console.error('Failed to delete notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/40 text-sm px-3 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-muted-foreground mt-1">Stay updated with your latest activities.</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={clearAll}>
            <Trash2 size={16} /> Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => !notification.read && markAsRead(notification.id)}
            className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 cursor-pointer ${
              notification.read 
                ? 'bg-card/50 border-border/50 opacity-70' 
                : 'bg-card border-primary-100 dark:border-primary-900/30 shadow-sm ring-1 ring-primary-500/5 hover:border-primary-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              notification.read ? 'bg-muted' : 'bg-primary-50 dark:bg-primary-900/20'
            }`}>
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-bold ${notification.read ? 'text-foreground/70' : 'text-foreground'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(notification.created_at)}
                </span>
              </div>
              <p className={`text-sm mt-1 ${notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                {notification.message}
              </p>
            </div>

            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 shadow-lg shadow-primary-500/50" />
            )}
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            <Bell size={40} />
          </div>
          <h3 className="text-xl font-bold">All caught up!</h3>
          <p className="text-muted-foreground max-w-xs mt-2">
            You don't have any new notifications at the moment.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsView;
