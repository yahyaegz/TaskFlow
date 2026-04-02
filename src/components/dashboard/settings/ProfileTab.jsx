import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../hooks/useSettings';
import Button from '../../ui/Button';

const ProfileTab = () => {
  const { user } = useAuth();
  const { loading, updateProfile } = useSettings();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, email });
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
            <User size={14} /> Profile Information
          </h3>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {user?.name?.[0]}
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground leading-none">{user?.name}</h4>
              <p className="text-muted-foreground mt-1 text-sm">{user?.email}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8">Change Avatar</Button>
                <input type="file" className="hidden" id="avatar-upload" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" className="w-full md:w-auto px-10" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default ProfileTab;
