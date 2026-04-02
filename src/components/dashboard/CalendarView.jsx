import React, { useState, useMemo } from 'react';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import 'react-day-picker/dist/style.css';

const CalendarView = ({ tasks, onTaskClick, onQuickAdd }) => {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = task.dueDate.split('T')[0];
        if (!map[date]) map[date] = [];
        map[date].push(task);
      }
    });
    return map;
  }, [tasks]);

  const selectedDayTasks = useMemo(() => {
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return tasksByDay[dateStr] || [];
  }, [selectedDay, tasksByDay]);

  const modifiers = {
    hasTasks: (date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return !!tasksByDay[dateStr];
    }
  };

  const modifiersStyles = {
    hasTasks: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: 'var(--primary)'
    }
  };

  const footer = (
    <div className="mt-8 pt-8 border-t border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          {format(selectedDay, 'MMMM do, yyyy')}
          <span className="bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs px-3 py-1 rounded-full">{selectedDayTasks.length} Tasks</span>
        </h3>
        <button 
          onClick={() => onQuickAdd(selectedDay)}
          className="p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {selectedDayTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => onTaskClick(task)}
              className="p-4 bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-soft hover:shadow-premium-hover hover:border-primary-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={task.priority}>{task.priority}</Badge>
                <span className={`text-xs font-black uppercase tracking-widest ${task.completed ? 'text-green-500' : 'text-slate-400'}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className={`font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                {task.title}
              </h4>
            </motion.div>
          ))}
        </AnimatePresence>
        {selectedDayTasks.length === 0 && (
          <div className="col-span-full py-12 text-center glass rounded-3xl border-dashed border-2">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No tasks scheduled for this day</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-8 pb-20">
      <Card className="p-8 md:p-12 overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-xl border-border shadow-premium">
        <style>{`
          .rdp {
            --rdp-cell-size: 50px;
            --rdp-accent-color: #7c3aed;
            --rdp-background-color: #ede9fe;
            margin: 0;
            width: 100%;
          }
          .rdp-months {
            justify-content: center;
            width: 100%;
          }
          .rdp-month {
            width: 100%;
          }
          .rdp-table {
            max-width: 100%;
            width: 100%;
          }
          .rdp-day_selected {
            background-color: var(--rdp-accent-color) !important;
            color: white !important;
            border-radius: 1rem;
            font-weight: 900;
            box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);
          }
          .rdp-day:hover:not(.rdp-day_selected) {
            background-color: var(--rdp-background-color);
            border-radius: 1rem;
          }
          .dark .rdp-day:hover:not(.rdp-day_selected) {
            background-color: rgba(124, 58, 237, 0.1);
          }
          .rdp-head_cell {
            text-transform: uppercase;
            font-size: 0.75rem;
            font-weight: 900;
            color: #94a3b8;
            padding-bottom: 1rem;
          }
          .rdp-day {
            font-weight: 600;
            height: var(--rdp-cell-size);
            width: var(--rdp-cell-size);
          }
          .day-with-tasks::after {
            content: '';
            position: absolute;
            bottom: 6px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #7c3aed;
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={(day) => day && setSelectedDay(day)}
          month={month}
          onMonthChange={setMonth}
          modifiers={modifiers}
          modifiersClassNames={{
            hasTasks: 'day-with-tasks'
          }}
          className="mx-auto"
        />
        {footer}
      </Card>
    </div>
  );
};

export default CalendarView;
