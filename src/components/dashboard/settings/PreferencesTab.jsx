import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Laptop, Globe, Bell, Loader2, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../hooks/useSettings';
import { useLanguage } from '../../../context/LanguageContext';
import Button from '../../ui/Button';

const PreferencesTab = () => {
  const { user } = useAuth();
  const { loading, updatePreferences } = useSettings();
  const { language, setLanguage, t } = useLanguage();
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [notifications, setNotifications] = useState(
    user?.notification_preferences || { email: true, push: true, taskUpdates: true }
  );

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.removeItem('theme');
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    }
  };

  const handleSave = async () => {
    await updatePreferences(notifications);
  };

  const handleExportJSON = () => {
    window.open('/api/v1/users/export?format=json', '_blank');
  };

  const handleExportCSV = () => {
    window.open('/api/v1/users/export?format=csv', '_blank');
  };

  const themeOptions = [
    { id: 'light', name: t('light'), icon: Sun },
    { id: 'dark', name: t('dark'), icon: Moon },
    { id: 'system', name: t('system'), icon: Laptop },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Appearance Section */}
      <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('preferences')}</h3>
        </div>
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('color_theme')}</label>
            <div className="grid grid-cols-3 gap-4">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleThemeChange(option.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    theme === option.id 
                      ? 'border-primary-500 bg-primary-500/5 text-primary-600' 
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-primary-200'
                  }`}
                >
                  <option.icon size={24} />
                  <span className="text-sm font-bold">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-border/50 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-bold text-foreground">{t('language')}</p>
                  <p className="text-xs text-muted-foreground">Select your preferred interface language.</p>
                </div>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-muted border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Bell size={14} /> {t('notifications')}
          </h3>
        </div>
        <div className="p-8 space-y-6">
          {[
            { id: 'email', title: 'Email Notifications', desc: 'Receive daily summaries and alerts via email.' },
            { id: 'push', title: 'Push Notifications', desc: 'Get immediate alerts in your browser.' },
            { id: 'taskUpdates', title: 'Task Updates', desc: 'Notify me when my requested tasks are completed.' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-border/50 pb-6 last:border-0 last:pb-0">
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications[item.id]}
                  onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          ))}
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto px-10">
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {t('save_preferences')}
            </Button>
          </div>
        </div>
      </section>

      {/* Data Portability Section */}
      <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Download size={14} /> Data Portability
          </h3>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-6 last:border-0 last:pb-0">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Export Your Data</h4>
              <p className="text-xs text-muted-foreground mt-1">Download a copy of all your tasks, categories, and tags.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-10 px-4" onClick={handleExportJSON}>
                <FileJson size={14} /> JSON
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-10 px-4" onClick={handleExportCSV}>
                <FileSpreadsheet size={14} /> CSV
              </Button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PreferencesTab;
