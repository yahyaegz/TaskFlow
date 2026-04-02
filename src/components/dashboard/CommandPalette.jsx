import React, { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Layout, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  LogOut,
  CheckCircle2,
  Circle,
  Hash
} from 'lucide-react';
import { cn } from '../../utils/cn';

const CommandPalette = ({ 
  tasks = [], 
  onNavigate, 
  onToggleTheme, 
  onLogout,
  onToggleTask
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Toggle the menu when Ctrl+K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
            >
              <Command className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center border-b border-border/50 px-6 py-4">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <Command.Input
                    placeholder="Type a command or search tasks..."
                    className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                    value={search}
                    onValueChange={setSearch}
                  />
                  <div className="flex items-center gap-1.5 ml-4">
                    <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase border border-border">ESC</kbd>
                  </div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3 space-y-2">
                  <Command.Empty className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div className="mt-2 space-y-1">
                      <Command.Item
                        onSelect={() => runCommand(() => onNavigate('tasks'))}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary-500 aria-selected:text-white text-slate-600 dark:text-slate-300 font-bold transition-all group"
                      >
                        <Layout size={18} />
                        <span>Go to Dashboard</span>
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(() => onNavigate('analytics'))}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary-500 aria-selected:text-white text-slate-600 dark:text-slate-300 font-bold transition-all group"
                      >
                        <TrendingUp size={18} />
                        <span>View Analytics</span>
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(() => onNavigate('notifications'))}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary-500 aria-selected:text-white text-slate-600 dark:text-slate-300 font-bold transition-all group"
                      >
                        <Bell size={18} />
                        <span>View Notifications</span>
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(() => onNavigate('settings'))}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary-500 aria-selected:text-white text-slate-600 dark:text-slate-300 font-bold transition-all group"
                      >
                        <Settings size={18} />
                        <span>Account Settings</span>
                      </Command.Item>
                    </div>
                  </Command.Group>

                  <Command.Group heading="Actions" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">
                    <div className="mt-2 space-y-1">
                      <Command.Item
                        onSelect={() => runCommand(onToggleTheme)}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary-500 aria-selected:text-white text-slate-600 dark:text-slate-300 font-bold transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Sun className="dark:hidden" size={18} />
                          <Moon className="hidden dark:block" size={18} />
                          <span>Toggle Dark Mode</span>
                        </div>
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(onLogout)}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-red-500 aria-selected:text-white text-red-500 dark:text-red-400 font-bold transition-all group"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </Command.Item>
                    </div>
                  </Command.Group>

                  {tasks.length > 0 && (
                    <Command.Group heading="Tasks" className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">
                      <div className="mt-2 space-y-1">
                        {tasks.slice(0, 10).map(task => (
                          <Command.Item
                            key={task.id}
                            onSelect={() => runCommand(() => onToggleTask(task.id, !task.completed))}
                            className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary-500 aria-selected:text-white text-slate-600 dark:text-slate-300 font-bold transition-all group"
                          >
                            {task.completed ? <CheckCircle2 size={18} className="text-primary-500 group-aria-selected:text-white" /> : <Circle size={18} />}
                            <span className={cn("truncate", task.completed && "line-through opacity-60")}>{task.title}</span>
                            {task.priority === 'high' && (
                               <span className="ml-auto px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase">High</span>
                            )}
                          </Command.Item>
                        ))}
                      </div>
                    </Command.Group>
                  )}
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
