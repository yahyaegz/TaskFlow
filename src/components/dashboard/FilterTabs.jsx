import React from 'react';
import { motion } from 'framer-motion';

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = ['all', 'pending', 'completed'];

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-2xl border border-border">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`relative px-6 py-2 text-sm font-bold capitalize transition-colors
            ${activeFilter === filter ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <span className="relative z-10">{filter}</span>
          {activeFilter === filter && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
