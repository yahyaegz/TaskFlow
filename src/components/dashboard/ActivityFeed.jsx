import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  History,
  Loader2
} from 'lucide-react';
import { apiFetch } from '../../utils/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiFetch('/api/v1/tasks/activities');
        if (res.success) {
          setActivities(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getIcon = (action) => {
    switch (action) {
      case 'create_task': return <PlusCircle size={14} className="text-primary-500" />;
      case 'complete_task': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'delete_task': return <Trash2 size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getLabel = (action) => {
    switch (action) {
      case 'create_task': return 'Created';
      case 'complete_task': return 'Completed';
      case 'delete_task': return 'Deleted';
      default: return 'Action';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin text-slate-300" size={20} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <History size={14} className="text-slate-400" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black">Recent Activity</span>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {activities.length > 0 ? (
            activities.map((activity, idx) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative pl-6 pb-4 border-l border-slate-200 dark:border-slate-800 last:pb-0"
              >
                <div className="absolute -left-[7.5px] top-0 bg-white dark:bg-slate-950 p-0.5 rounded-full ring-4 ring-white dark:ring-slate-950">
                  {getIcon(activity.action)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    <span className="text-slate-400 font-medium mr-1">{getLabel(activity.action)}</span>
                    "{activity.task_title || activity.details?.title || 'Unknown Task'}"
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="px-4 py-8 text-center glass rounded-2xl border-dashed border">
               <p className="text-[10px] font-black uppercase text-slate-400">No activity yet</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityFeed;
