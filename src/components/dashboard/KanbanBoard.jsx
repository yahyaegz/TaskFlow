import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import BoardColumn from './BoardColumn';
import DraggableTaskCard from './DraggableTaskCard';

const KanbanBoard = ({ tasks, onTaskMove, onTaskClick }) => {
  const [activeTask, setActiveTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    if (active.id !== over.id) {
      const activeTaskData = tasks.find(t => t.id === active.id);
      const overId = over.id;
      
      const isColumn = columns.find(c => c.id === overId);
      const targetStatus = isColumn ? overId : tasks.find(t => t.id === overId)?.status;

      if (activeTaskData.status !== targetStatus) {
        onTaskMove(active.id, { status: targetStatus });
      }
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col lg:flex-row gap-6 mt-8 pb-12 overflow-x-auto min-h-[600px] custom-scrollbar">
        {columns.map(column => (
          <BoardColumn 
            key={column.id} 
            id={column.id} 
            title={column.title}
            color={column.color}
            tasks={tasks.filter(t => t.status === column.id)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="w-[320px] scale-105 rotate-3 opacity-90 cursor-grabbing">
             <DraggableTaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
