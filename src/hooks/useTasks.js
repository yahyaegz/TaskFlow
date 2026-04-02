import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useSocket } from '../context/SocketContext';

export const useTasks = (activeFilter, selectedCategory, selectedTag, searchQuery) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [performanceMode, setPerformanceMode] = useState(false);
  const toast = useToast();
  const { socket } = useSocket();

  const fetchInitialData = useCallback(async () => {
    try {
      const [tasksData, categoriesData, tagsData] = await Promise.all([
        apiFetch('/api/v1/tasks'),
        apiFetch('/api/v1/categories'),
        apiFetch('/api/v1/tags')
      ]);

      if (tasksData.success) {
        let allTasks = tasksData.data;
        if (performanceMode && allTasks.length > 0) {
          const extraTasks = Array.from({ length: 1000 }).map((_, i) => ({
            ...allTasks[0],
            id: `sim-${i}`,
            title: `Simulated Task ${i + 1}`
          }));
          allTasks = [...allTasks, ...extraTasks];
        }
        setTasks(allTasks);
      }
      
      if (categoriesData.success) setCategories(categoriesData.data);
      if (tagsData.success) setTags(tagsData.data);
      
      if (!tasksData.success || !categoriesData.success || !tagsData.success) {
        const errorMsg = tasksData.error || categoriesData.error || tagsData.error || 'Failed to fetch data';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      setError('Failed to fetch initial data');
      toast.error('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [toast, performanceMode]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Real-time Sync Logic
  useEffect(() => {
    if (!socket) return;

    const handleRemoteCreate = (task) => {
      setTasks(prev => {
        if (prev.some(t => t.id === task.id)) return prev;
        toast.info(`New task added from another device: "${task.title}"`);
        return [task, ...prev];
      });
    };

    const handleRemoteUpdate = (task) => {
      setTasks(prev => {
        const index = prev.findIndex(t => t.id === task.id);
        if (index === -1) return prev;
        
        // Only show toast if it's not an optimistic update already applied
        // (Though with Socket.io user-specific rooms, we might still get our own events back 
        // depending on how we broadcast. Our current implementation broadcasts to everyone in the user room.)
        // To prevent duplicate toasts for our own actions, we could check a 'clientId' or similar.
        // For now, let's just update the state.
        
        const newTasks = [...prev];
        newTasks[index] = task;
        return newTasks;
      });
    };

    const handleRemoteDelete = ({ id }) => {
      setTasks(prev => {
        const task = prev.find(t => t.id === id);
        if (task) {
          toast.info(`Task deleted from another device: "${task.title}"`);
        }
        return prev.filter(t => t.id !== id);
      });
    };

    socket.on('task:created', handleRemoteCreate);
    socket.on('task:updated', handleRemoteUpdate);
    socket.on('task:deleted', handleRemoteDelete);

    return () => {
      socket.off('task:created', handleRemoteCreate);
      socket.off('task:updated', handleRemoteUpdate);
      socket.off('task:deleted', handleRemoteDelete);
    };
  }, [socket, toast]);

  const togglePerformanceMode = useCallback(() => {
    setPerformanceMode(prev => {
      const newVal = !prev;
      toast.info(newVal ? "Performance Mode: ON (1000+ tasks simulated)" : "Performance Mode: OFF");
      return newVal;
    });
  }, [toast]);

  const addTask = useCallback(async (taskData) => {
    let processedData = { ...taskData };
    if (selectedCategory && !processedData.categoryId) {
      processedData.categoryId = selectedCategory;
    }

    const titleLower = taskData.title.toLowerCase();
    if (titleLower.includes('high priority') || titleLower.includes('urgent')) processedData.priority = 'high';
    else if (titleLower.includes('low priority')) processedData.priority = 'low';
    
    const today = new Date();
    if (titleLower.includes('tomorrow')) {
       const tomorrow = new Date(today);
       tomorrow.setDate(today.getDate() + 1);
       processedData.dueDate = tomorrow.toISOString().split('T')[0];
    } else if (titleLower.includes('next week')) {
       const nextWeek = new Date(today);
       nextWeek.setDate(today.getDate() + 7);
       processedData.dueDate = nextWeek.toISOString().split('T')[0];
    }

    const tempId = Date.now().toString();
    const optimisticTask = { 
      id: tempId, 
      ...processedData, 
      status: 'todo', 
      createdAt: new Date().toISOString(),
      optimistic: true 
    };
    setTasks(prev => [optimisticTask, ...prev]);

    try {
      const data = await apiFetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });
      if (data.success) {
        setTasks(prev => prev.map(t => t.id === tempId ? data.data : t));
        // toast.success('Task added successfully!'); // Reduced noise, backend sync will handle visual
      } else {
        setTasks(prev => prev.filter(t => t.id !== tempId));
        toast.error(data.error || 'Failed to add task');
      }
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      toast.error('Failed to add task');
    }
  }, [selectedCategory, toast]);

  const smartAddTask = useCallback(async (text) => {
    try {
      const data = await apiFetch('/api/v1/tasks/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (data.success) {
        setTasks(prev => [data.data, ...prev]);
        toast.success('Smart task added!');
        return true;
      } else {
        toast.error(data.error || 'Smart add failed');
        return false;
      }
    } catch (err) {
      toast.error('Connection error');
      return false;
    }
  }, [toast]);

  const toggleTask = useCallback(async (id, completed) => {
    // Optimistic
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    
    try {
      const data = await apiFetch(`/api/v1/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (data.success) {
        setTasks(prev => prev.map(t => t.id === id ? data.data : t));
        // toast.success(completed ? 'Task completed!' : 'Task reopened');
      } else {
        // Rollback
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
        toast.error('Failed to update task');
      }
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
      toast.error('Connection error');
    }
  }, [toast]);

  const deleteTask = useCallback(async (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    
    try {
      const data = await apiFetch(`/api/v1/tasks/${id}`, {
        method: 'DELETE',
      });
      if (data.success) {
        // toast.success('Task deleted');
      } else {
        if (taskToDelete) setTasks(prev => [taskToDelete, ...prev]);
        toast.error('Failed to delete task');
      }
    } catch (err) {
      if (taskToDelete) setTasks(prev => [taskToDelete, ...prev]);
      toast.error('Connection error');
    }
  }, [tasks, toast]);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const data = await apiFetch(`/api/v1/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (data.success) {
        setTasks(prev => prev.map(t => t.id === id ? data.data : t));
        toast.success('Task updated');
      } else {
        toast.error('Failed to update task');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  }, [toast]);

  const addCategory = useCallback(async (name, color) => {
    try {
      const data = await apiFetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color })
      });
      if (data.success) {
        setCategories(prev => [...prev, data.data]);
        toast.success(`Category "${name}" created`);
        return data.data;
      } else {
        toast.error('Failed to create category');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  }, [toast]);

  const updateCategory = useCallback(async (id, name, color) => {
    try {
      const data = await apiFetch(`/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color })
      });
      if (data.success) {
        setCategories(prev => prev.map(c => c.id === id ? data.data : c));
        toast.success(`Category updated`);
        return data.data;
      } else {
        toast.error('Failed to update category');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  }, [toast]);

  const deleteCategory = useCallback(async (id) => {
    try {
      const data = await apiFetch(`/api/v1/categories/${id}`, {
        method: 'DELETE',
      });
      if (data.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success('Category deleted');
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  }, [toast]);

  const addTag = useCallback(async (name, color) => {
    try {
      const data = await apiFetch('/api/v1/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color })
      });
      if (data.success) {
        setTags(prev => [...prev, data.data]);
        toast.success(`Tag #${name} created`);
        return data.data;
      } else {
        toast.error('Failed to create tag');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  }, [toast]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    
    if (activeFilter === 'pending') result = result.filter(t => t.status !== 'done');
    else if (activeFilter === 'completed') result = result.filter(t => t.status === 'done');
    
    if (selectedCategory) {
      result = result.filter(t => t.categoryId === selectedCategory);
    }
    
    if (selectedTag) {
      result = result.filter(t => t.tags?.some(tag => tag.id === selectedTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [tasks, activeFilter, selectedCategory, selectedTag, searchQuery]);

  return {
    tasks,
    categories,
    tags,
    loading,
    error,
    filteredTasks,
    addTask,
    smartAddTask,
    toggleTask,
    deleteTask,
    updateTask,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    togglePerformanceMode
  };
};
