import React, { useState, forwardRef, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Calendar
} from 'lucide-react';
import Badge from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

const ProgressRing = ({ percentage }) => {
  const radius = 18;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: 0 }}
          className="text-slate-200 dark:text-slate-800"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-500 ease-in-out"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-[8px] font-black text-slate-500 dark:text-slate-400">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

const TaskItem = memo(forwardRef(({ task, onToggle, onDelete, onUpdate, onClick }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { t } = useLanguage();

  const handleUpdate = useCallback((e) => {
    if (e) e.stopPropagation();
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle });
    }
    setIsEditing(false);
  }, [editTitle, task.id, task.title, onUpdate]);

  const onToggleClick = useCallback((e) => {
    e.stopPropagation();
    onToggle(task.id, !task.completed);
  }, [task.id, task.completed, onToggle]);

  const onDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete(task.id);
  }, [task.id, onDelete]);

  const onEditStart = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const isHighPriority = task.priority === 'high';
  
  const subtaskTotal = task.subtaskStats?.total || 0;
  const subtaskCompleted = task.subtaskStats?.completed || 0;
  const progress = subtaskTotal > 0 ? (subtaskCompleted / subtaskTotal) * 100 : (task.completed ? 100 : 0);

  return (
    <motion.div
      layout
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={onClick}
      className={`
        group relative flex items-center gap-5 p-5 
        bg-card border border-border shadow-soft
        hover:shadow-premium-hover hover:border-primary-500/30
        transition-all duration-300 ease-out cursor-pointer rounded-2xl
        ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}
      `}
    >
      {/* Premium Pulsing Indicator for High Priority */}
      {isHighPriority && !task.completed && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-slate-950"></span>
        </span>
      )}

      <div className="flex-shrink-0 relative">
        <button 
          onClick={onToggleClick}
          className="relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 rounded-full transition-transform active:scale-90 z-10"
        >
          {task.completed ? (
            <CheckCircle2 size={26} className="text-primary-600 fill-primary-50 dark:fill-primary-950/30" />
          ) : (
            <Circle size={26} className="text-slate-300 dark:text-slate-700 group-hover:text-primary-400 transition-colors" />
          )}
        </button>
        
        {/* Progress ring around the toggle or next to it? Let's put it next to the content for better visibility if subtasks exist */}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            className="w-full bg-transparent px-0 py-0 text-lg font-bold outline-none border-b-2 border-primary-500 text-foreground"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdate();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className={`text-lg font-bold tracking-tight truncate transition-colors ${
            task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}>
            {task.title}
          </h3>
        )}

        <div className="flex items-center gap-3 mt-2">
          <Badge variant={task.priority} className="shadow-sm">
            {t(task.priority + '_priority')}
          </Badge>
          
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Calendar size={13} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {subtaskTotal > 0 && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/50">
               <ProgressRing percentage={progress} />
               <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{subtaskCompleted}/{subtaskTotal}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modern Action Buttons */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
        <button 
          onClick={onEditStart}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
        >
          <Edit3 size={16} />
        </button>
        <button 
          onClick={onDeleteClick}
          className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}));

export default TaskItem;
