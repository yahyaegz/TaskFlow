import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  LogOut, 
  User, 
  Layout, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  CheckCircle2,
  Calendar as CalendarIcon,
  Layers,
  Edit3,
  Trash2,
  ChevronRight,
  TrendingUp,
  History,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import DashboardCards from '../components/dashboard/DashboardCards';
import TaskInput from '../components/dashboard/TaskInput';
import TaskList from '../components/dashboard/TaskList';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import CalendarView from '../components/dashboard/CalendarView';
import FilterTabs from '../components/dashboard/FilterTabs';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import NotificationsView from '../components/dashboard/NotificationsView';
import TaskDetailsModal from '../components/dashboard/TaskDetailsModal';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import CommandPalette from '../components/dashboard/CommandPalette';
import ActivityFeed from '../components/dashboard/ActivityFeed';

// Lazy loaded components
const SettingsView = lazy(() => import('../components/dashboard/SettingsView'));
const ProductivityChart = lazy(() => import('../components/dashboard/ProductivityChart'));

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const { t } = useLanguage();
  const { isConnected } = useSocket();
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'kanban'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const {
    tasks,
    categories,
    tags,
    loading,
    error,
    filteredTasks,
    addTask,
    smartAddTask,
    toggleTask,
    deleteTask,
    updateTask,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    togglePerformanceMode
  } = useTasks(activeFilter, selectedCategory, selectedTag, searchQuery);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    if (user?.view_preference) {
      setViewMode(user.view_preference);
    }
  }, [user?.view_preference]);

  const handleViewModeChange = async (mode) => {
    setViewMode(mode);
    try {
      await fetch('/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ view_preference: mode }),
      });
    } catch (err) {
      console.error('Failed to save view preference:', err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'n' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.querySelector('input[placeholder="' + t('search_tasks') + '"]');
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        togglePerformanceMode();
      }

      // 'd' for dashboard
      if (e.key.toLowerCase() === 'd' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleViewChange('tasks');
      }

      // 'esc' to close everything
      if (e.key === 'Escape') {
        setSelectedTask(null);
        setIsSidebarOpen(false);
        setIsAddingCategory(false);
        setIsAddingTag(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePerformanceMode, t]);

  const handleViewChange = (view) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const getRandomColor = () => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddCategory = async (e) => {
    if (e.key === 'Enter' && newCategoryName.trim()) {
      const success = await addCategory(newCategoryName, getRandomColor());
      if (success) {
        setNewCategoryName('');
        setIsAddingCategory(false);
      }
    } else if (e.key === 'Escape') {
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    if (e.key === 'Enter' && editingCategoryName.trim()) {
      const category = categories.find(c => c.id === editingCategoryId);
      const success = await updateCategory(editingCategoryId, editingCategoryName, category.color);
      if (success) {
        setEditingCategoryId(null);
        setEditingCategoryName('');
      }
    } else if (e.key === 'Escape') {
      setEditingCategoryId(null);
      setEditingCategoryName('');
    }
  };

  const handleDeleteCategory = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category? Tasks in this category will not be deleted.')) {
      await deleteCategory(id);
      if (selectedCategory === id) {
        setSelectedCategory(null);
      }
    }
  };

  const handleAddTag = async (e) => {
    if (e.key === 'Enter' && newTagName.trim()) {
      const success = await addTag(newTagName, getRandomColor());
      if (success) {
        setNewTagName('');
        setIsAddingTag(false);
      }
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
    }
  };

  const handleCalendarQuickAdd = (date) => {
    // Focus the task input and pre-fill it with a prompt?
    // Or just scroll to it.
    const input = document.querySelector('input[placeholder="' + t('search_tasks') + '"]');
    if (input) {
      // For now, let's just toast that we're adding for this date
      // In a real app we'd pre-set the state of TaskInput
      const dateStr = date.toISOString().split('T')[0];
      toast.info(`Creating task for ${dateStr}`);
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden selection:bg-primary-500/30">
      <CommandPalette 
        tasks={tasks}
        onNavigate={handleViewChange}
        onToggleTheme={toggleTheme}
        onLogout={logout}
        onToggleTask={toggleTask}
      />
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-5 border-b border-border bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <Layout size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">TaskFlow</h1>
            {!isConnected && (
              <span className="text-[8px] font-black uppercase text-amber-500 mt-0.5 flex items-center gap-1">
                <WifiOff size={8} /> Offline Mode
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 md:hidden"
              />
            )}
            <motion.aside
              initial={isMobile ? { x: -320 } : false}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className={`fixed md:relative inset-y-0 left-0 w-80 glass border-r border-border/50 z-50 flex flex-col shadow-2xl md:shadow-none p-6`}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-premium">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">TaskFlow</h1>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 font-black opacity-80">Workspace</span>
                      <div className="flex items-center gap-1">
                        <div className={`w-1 h-1 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isConnected ? 'text-green-600/50 dark:text-green-400/50' : 'text-amber-600/50 dark:text-amber-400/50'}`}>
                          {isConnected ? 'Sync Active' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {isSidebarOpen && (
                  <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 font-black px-4 mb-4">Main Menu</div>
                  <div className="space-y-1">
                    {[
                      { id: 'tasks', label: t('dashboard'), icon: Layout },
                      { id: 'analytics', label: t('analytics') || 'Analytics', icon: TrendingUp },
                      { id: 'notifications', label: t('notifications'), icon: Bell },
                      { id: 'settings', label: t('settings'), icon: Settings },
                    ].map((item) => (
                      <Button 
                        key={item.id}
                        variant="ghost" 
                        onClick={() => handleViewChange(item.id)}
                        className={`w-full justify-start gap-4 h-12 transform-none group relative px-4 ${activeView === item.id ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        {activeView === item.id && (
                          <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-r-full" />
                        )}
                        <item.icon size={20} className={activeView === item.id ? 'text-primary-600 dark:text-primary-400' : 'group-hover:text-slate-900 dark:group-hover:text-white transition-colors'} /> 
                        <span className="font-bold">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between px-4 mb-4">
                    <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 font-black">{t('categories')}</div>
                    <button 
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-slate-400 hover:text-primary-600 transition-colors p-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full justify-start gap-4 h-11 transform-none text-sm px-4 ${!selectedCategory ? 'text-primary-600 dark:text-primary-400 font-black bg-primary-500/5' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <Layers size={18} /> {t('all_tasks')}
                    </Button>
                    
                    {categories.map(cat => (
                      <div key={cat.id} className="group relative flex items-center">
                        {editingCategoryId === cat.id ? (
                          <div className="flex-1 px-4 py-1">
                             <input 
                               autoFocus
                               value={editingCategoryName}
                               onChange={(e) => setEditingCategoryName(e.target.value)}
                               onKeyDown={handleUpdateCategory}
                               onBlur={() => { setEditingCategoryId(null); setEditingCategoryName(''); }}
                               className="w-full bg-white dark:bg-slate-900 border-2 border-primary-500 rounded-xl px-3 py-1.5 text-xs font-bold shadow-lg"
                             />
                          </div>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`flex-1 justify-start gap-4 h-11 transform-none text-sm px-4 pr-16 truncate ${selectedCategory === cat.id ? 'text-primary-600 dark:text-primary-400 font-black bg-primary-500/5' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                              <span className="truncate">{cat.name}</span>
                            </Button>
                            <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                              <button onClick={(e) => { e.stopPropagation(); setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); }} className="p-1.5 hover:text-primary-600 text-slate-400 transition-colors bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                <Edit3 size={12} />
                              </button>
                              <button onClick={(e) => handleDeleteCategory(e, cat.id)} className="p-1.5 hover:text-red-500 text-slate-400 transition-colors bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 px-4">
                   <ActivityFeed />
                </div>
              </nav>

              {/* User Profile Card */}
              <div className="mt-auto pt-6 border-t border-border/50 px-2">
                <div className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20">
                    {user?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate text-slate-900 dark:text-white leading-tight">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <ThemeToggle />
                  <Button 
                    variant="ghost" 
                    className="flex-1 justify-center gap-2 text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 h-11 px-0"
                    onClick={logout}
                  >
                    <LogOut size={18} /> <span className="font-black text-xs uppercase tracking-widest">{t('logout')}</span>
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <AnimatePresence mode="wait">
            {activeView === 'tasks' && (
              <motion.div
                key="tasks-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[11px] font-black uppercase tracking-widest"
                    >
                      <Layers size={12} /> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </motion.div>
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                      {t('welcome_back')}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl">
                      Success starts with a single step. Here's your mission for today.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-soft border border-border">
                    <div className="pl-3 text-slate-400">
                      <Search size={20} />
                    </div>
                    <input 
                      type="text" 
                      placeholder={t('search_tasks')} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none py-2 text-sm w-full md:w-64 font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    <div className="flex items-center gap-1.5 border-l border-border pl-2.5 ml-1">
                       <button onClick={() => handleViewModeChange('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                         <ListIcon size={18} />
                       </button>
                       <button onClick={() => handleViewModeChange('kanban')} className={`p-2 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                         <LayoutGrid size={18} />
                       </button>
                       <button onClick={() => handleViewModeChange('calendar')} className={`p-2 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                         <CalendarIcon size={18} />
                       </button>
                    </div>
                  </div>
                </header>

                <DashboardCards tasks={tasks} loading={loading} />

                <section className="mt-20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-6 border-b border-border/50">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-4">
                      {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : t('all_tasks')} 
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-black px-4 py-1.5 rounded-2xl shadow-inner min-w-[40px] text-center">{filteredTasks.length}</span>
                    </h2>
                    <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                  </div>

                  <div className="max-w-4xl">
                    <TaskInput onAddTask={addTask} onSmartAddTask={smartAddTask} />

                    <div className="mt-12">
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <div className="space-y-5 py-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-border shadow-soft">
                                <Skeleton width="28px" height="28px" borderRadius="999px" />
                                <div className="flex-1 space-y-3">
                                  <Skeleton width="70%" height="22px" />
                                  <div className="flex gap-3">
                                    <Skeleton width="80px" height="20px" borderRadius="999px" />
                                    <Skeleton width="120px" height="14px" />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                   <Skeleton width="40px" height="40px" borderRadius="1rem" />
                                   <Skeleton width="40px" height="40px" borderRadius="1rem" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : viewMode === 'list' ? (
                          <TaskList
                            tasks={filteredTasks}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onUpdate={updateTask}
                            onTaskClick={setSelectedTask}
                          />
                        ) : viewMode === 'calendar' ? (
                          <CalendarView 
                            tasks={filteredTasks}
                            onTaskClick={setSelectedTask}
                            onQuickAdd={handleCalendarQuickAdd}
                          />
                        ) : (
                          <KanbanBoard 
                            tasks={filteredTasks} 
                            onTaskMove={updateTask}
                            onTaskClick={setSelectedTask}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeView === 'notifications' && (
              <motion.div
                key="notifications-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-4xl mx-auto"
              >
                <NotificationsView />
              </motion.div>
            )}

            {activeView === 'analytics' && (
              <motion.div
                key="analytics-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-5xl mx-auto"
              >
                <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>}>
                  <ProductivityChart />
                </Suspense>
              </motion.div>
            )}

            {activeView === 'settings' && (
              <motion.div
                key="settings-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-5xl mx-auto"
              >
                <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>}>
                  <SettingsView />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Modal Backdrop */}
          <AnimatePresence>
            {selectedTask && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedTask(null)}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-4xl max-h-full overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-modal border border-white/10"
                >
                  <TaskDetailsModal 
                    task={selectedTask}
                    categories={categories}
                    tags={tags}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={updateTask}
                    onDelete={(id) => {
                      deleteTask(id);
                      setSelectedTask(null);
                    }}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
