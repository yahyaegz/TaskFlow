import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const ProgressRing = ({ percentage }) => {
  const radius = 12;
  const stroke = 2;
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
    </div>
  );
};

const DraggableTaskCard = ({ task, onClick, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: isOverlay });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : 1
  };

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-amber-500',
    low: 'border-l-blue-500',
  };

  const subtaskTotal = task.subtaskStats?.total || 0;
  const subtaskCompleted = task.subtaskStats?.completed || 0;
  const progress = subtaskTotal > 0 ? (subtaskCompleted / subtaskTotal) * 100 : (task.completed ? 100 : 0);

  return (
    <div ref={setNodeRef} style={style} className={isOverlay ? 'cursor-grabbing' : ''}>
      <Card 
        className={`p-5 group relative bg-card shadow-sm border-border/40 hover:shadow-xl transition-all duration-300 border-l-4 ${priorityColors[task.priority] || 'border-l-slate-300'}
          ${isOverlay ? 'shadow-premium ring-2 ring-primary-500/20' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          {!isOverlay && (
            <button 
              {...attributes} 
              {...listeners}
              className="mt-1 text-muted-foreground/20 hover:text-primary-500 cursor-grab active:cursor-grabbing transition-colors"
            >
              <GripVertical size={18} />
            </button>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className={`font-bold text-sm leading-snug tracking-tight text-foreground/90 ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </h4>
              {(subtaskTotal > 0 || task.completed) && (
                <div className="flex-shrink-0">
                  <ProgressRing percentage={progress} />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-border/30">
              <Badge variant={task.priority} className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-lg">
                {task.priority}
              </Badge>
              
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/60">
                  <Calendar size={12} className="text-primary-500/50" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DraggableTaskCard;
