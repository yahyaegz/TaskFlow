import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Flag, Send } from 'lucide-react';
import Button from '../ui/Button';

const TaskInput = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title, priority, dueDate: dueDate || null });
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <div className="relative group">
      <div 
        className={`bg-card rounded-2xl border-2 transition-all duration-300 shadow-soft overflow-hidden
          ${isExpanded ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-border group-hover:border-primary-400/50'}`}
      >
        <form onSubmit={handleSubmit} className="p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="p-2 bg-muted rounded-lg text-muted-foreground">
              <Plus size={20} />
            </div>
            <input
              type="text"
              placeholder="What needs to be done?..."
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/50 text-foreground"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
            {!isExpanded && (
              <Button 
                type="submit" 
                size="sm" 
                className="hidden md:flex" 
                disabled={!title.trim()}
              >
                Quick Add
              </Button>
            )}
          </div>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-2 border-t border-border/50 pt-2 px-3 pb-2 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-2 text-sm">
                  <Flag size={16} className="text-muted-foreground" />
                  <select
                    className="bg-muted px-3 py-1.5 rounded-lg border-none outline-none focus:ring-1 focus:ring-primary-500 text-foreground"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="relative flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <input
                    type="date"
                    className="bg-muted px-3 py-1.5 rounded-lg border-none outline-none focus:ring-1 focus:ring-primary-500 text-foreground"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="gap-2"
                  disabled={!title.trim()}
                >
                  Add Task <Send size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TaskInput;
