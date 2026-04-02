import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import TaskItem from './TaskItem';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const TaskList = memo(({ tasks, onToggle, onDelete, onUpdate, onTaskClick }) => {
  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center glass rounded-3xl mt-8 border-dashed border-2"
      >
        <div className="w-24 h-24 bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 text-primary-600 dark:text-primary-400 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
          <Rocket size={48} className="animate-pulse-slow" />
        </div>
        <h3 className="text-3xl font-black tracking-tight mb-3">All clear!</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
          You've conquered every task in this view. Enjoy the momentum or start something new and extraordinary.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 mt-8 pb-20"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

export default TaskList;
