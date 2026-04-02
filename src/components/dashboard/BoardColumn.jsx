import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import DraggableTaskCard from './DraggableTaskCard';

const BoardColumn = ({ id, title, color, tasks, onTaskClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-4 bg-muted/20 p-5 rounded-[2rem] border border-border/40 min-w-[340px] h-fit">
      <div className="flex items-center justify-between px-3 mb-1">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
          <h3 className="font-black text-lg tracking-tight text-foreground/90 uppercase text-xs">
            {title}
          </h3>
          <span className="text-[10px] bg-card border border-border/50 px-2 py-0.5 rounded-full text-muted-foreground font-bold shadow-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      <div ref={setNodeRef} className="flex-1 flex flex-col gap-4 min-h-[200px] p-1">
        <SortableContext 
          id={id}
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
