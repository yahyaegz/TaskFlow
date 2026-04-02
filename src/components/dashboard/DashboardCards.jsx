import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';

const DashboardCards = memo(({ tasks }) => {
  const { t } = useLanguage();
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed || t.status === 'done').length;
    const pending = total - completed;

    return [
      { 
        label: t('total_tasks'), 
        value: total, 
        icon: LayoutGrid, 
        color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
        description: 'Items in your workspace'
      },
      { 
        label: t('pending'), 
        value: pending, 
        icon: Clock, 
        color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        description: 'Tasks to be completed'
      },
      { 
        label: t('completed'), 
        value: completed, 
        icon: CheckCircle2, 
        color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        description: 'Finished achievements'
      },
    ];
  }, [tasks, t]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} hover className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-2xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <motion.span 
              key={stat.value}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black tracking-tight"
            >
              {stat.value}
            </motion.span>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
});

export default DashboardCards;
