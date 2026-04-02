import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ProfileTab from './settings/ProfileTab';
import PreferencesTab from './settings/PreferencesTab';
import SecurityTab from './settings/SecurityTab';
import Button from '../ui/Button';

const SettingsView = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  const settingsSections = [
    {
      id: 'profile',
      title: t('profile'),
      icon: <User size={20} />,
      description: 'Personal details and avatar.',
    },
    {
      id: 'preferences',
      title: t('preferences'),
      icon: <Bell size={20} />,
      description: 'Theme and notifications.',
    },
    {
      id: 'security',
      title: t('security'),
      icon: <Shield size={20} />,
      description: 'Password and protection.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl">
            <Settings size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">{t('settings')}</h2>
        </div>
        <p className="text-muted-foreground text-lg">Manage your account preferences and application configuration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-6">
          <nav className="flex flex-col gap-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex flex-col items-start gap-1 px-5 py-4 rounded-2xl transition-all text-left ${
                  activeTab === section.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <span className="font-bold">{section.title}</span>
                </div>
                {activeTab !== section.id && (
                  <span className="text-[10px] opacity-70 ml-8 line-clamp-1">{section.description}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-border/50">
             <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 px-5 py-4 rounded-2xl"
                onClick={logout}
              >
                <LogOut size={20} /> 
                <span className="font-bold">{t('logout')}</span>
              </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileTab key="profile" />}
            {activeTab === 'preferences' && <PreferencesTab key="preferences" />}
            {activeTab === 'security' && <SecurityTab key="security" />}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default SettingsView;
