import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Loader2, AlertCircle } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import Button from '../../ui/Button';

const SecurityTab = () => {
  const { loading, changePassword } = useSettings();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    const success = await changePassword(passwords.current, passwords.new);
    if (success) {
      setPasswords({ current: '', new: '', confirm: '' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Shield size={14} /> Password & Security
          </h3>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full md:w-auto px-10" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h4 className="font-bold text-lg mb-2">Two-Factor Authentication</h4>
        <p className="text-muted-foreground text-sm mb-6">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
        <Button variant="outline" size="sm" disabled>Enable 2FA (Coming Soon)</Button>
      </section>
    </motion.div>
  );
};

export default SecurityTab;
