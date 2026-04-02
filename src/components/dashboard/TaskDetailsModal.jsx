import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Calendar, 
  Layers, 
  CheckSquare, 
  Plus, 
  Clock,
  ChevronDown,
  Loader2,
  MessageCircle,
  Hash
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/api';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const TaskDetailsModal = ({ task, categories, tags, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [comments, setComments] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const [taskRes, commentsRes] = await Promise.all([
          apiFetch(`/api/v1/tasks/${task.id}`),
          apiFetch(`/api/v1/tasks/${task.id}/comments`)
        ]);
        
        if (taskRes.success) {
          setEditedTask(taskRes.data);
          setSubtasks(taskRes.data.subtasks || []);
        }
        if (commentsRes.success) setComments(commentsRes.data);
      } catch (err) {
        console.error('Failed to fetch task details:', err);
      }
    };
    fetchTaskDetails();
  }, [task.id]);

  const handleUpdate = async (updates) => {
    setSaving(true);
    try {
      await onUpdate(task.id, updates);
      setEditedTask(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTaskTag = (tag) => {
    const currentTags = editedTask.tags || [];
    const hasTag = currentTags.some(t => t.id === tag.id);
    let newTags;
    
    if (hasTag) {
      newTags = currentTags.filter(t => t.id !== tag.id);
    } else {
      newTags = [...currentTags, tag];
    }
    
    setEditedTask(prev => ({ ...prev, tags: newTags }));
    handleUpdate({ tags: newTags.map(t => t.id) });
  };

  const addSubtask = async (e) => {
    if (e.key === 'Enter' && newSubtask.trim()) {
      try {
        const res = await apiFetch(`/api/v1/tasks/${task.id}/subtasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newSubtask })
        });
        if (res.success) {
          setSubtasks([...subtasks, res.data]);
          setNewSubtask('');
        }
      } catch (err) {
        console.error('Failed to add subtask');
      }
    }
  };

  const toggleSubtask = async (id, completed) => {
    try {
      const res = await apiFetch(`/api/v1/tasks/${task.id}/subtasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      if (res.success) {
        setSubtasks(subtasks.map(s => s.id === id ? res.data : s));
      }
    } catch (err) {
      console.error('Failed to toggle subtask');
    }
  };

  const deleteSubtask = async (id) => {
    try {
      await apiFetch(`/api/v1/tasks/${task.id}/subtasks/${id}`, { method: 'DELETE' });
      setSubtasks(subtasks.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete subtask');
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await apiFetch(`/api/v1/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (res.success) {
        setComments([...comments, res.data]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post comment');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
      {/* Premium Modal Header */}
      <div className="px-10 py-8 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-premium bg-white dark:bg-slate-800`}>
             <Layers size={24} className="text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant={editedTask.priority}>{editedTask.priority}</Badge>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <Clock size={12} />
                <span>{new Date(editedTask.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400">Task Details</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { if(window.confirm('Delete this task?')) onDelete(task.id); }} 
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
          >
            <Trash2 size={18} />
          </Button>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-10">
          {/* Main Title Input */}
          <div className="relative group/title mb-10">
            <input 
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              onBlur={() => handleUpdate({ title: editedTask.title })}
              className="text-4xl font-black tracking-tighter bg-transparent border-none outline-none w-full focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-800 text-slate-900 dark:text-white pr-12"
              placeholder="What's this task called?"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <h3 className="text-sm font-black uppercase tracking-widest">Description</h3>
                </div>
                <textarea 
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  onBlur={() => handleUpdate({ description: editedTask.description })}
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-border rounded-[2rem] p-6 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-300"
                  placeholder="Elaborate on the details..."
                />
              </div>

              {/* Subtasks Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Subtasks</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">
                      {subtasks.filter(s => s.completed).length}/{subtasks.length}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-border p-6 space-y-2 relative overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {subtasks.map((sub, idx) => (
                      <motion.div 
                        key={sub.id} 
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all group"
                      >
                        <button 
                          onClick={() => toggleSubtask(sub.id, !sub.completed)}
                          className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center
                            ${sub.completed ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-transparent border-slate-300 dark:border-slate-700'}`}
                        >
                          {sub.completed && <CheckSquare size={16} />}
                        </button>
                        <span className={`text-sm font-bold flex-1 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {sub.title}
                        </span>
                        <button onClick={() => deleteSubtask(sub.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <div className="flex items-center gap-4 p-3 pt-5 border-t border-slate-200/50 dark:border-slate-800/50 mt-2">
                    <div className="w-6 h-6 flex items-center justify-center text-primary-500">
                      <Plus size={20} />
                    </div>
                    <input 
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={addSubtask}
                      placeholder="Add a new sub-objective..."
                      className="bg-transparent border-none outline-none text-sm font-bold w-full py-1 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Discussion Section */}
              <div className="space-y-6 pb-10">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-primary-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Discussion</h3>
                </div>
                
                <div className="space-y-6">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 shadow-sm border border-border">
                        {comment.user_name?.[0] || '?'}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 dark:text-white">{comment.user_name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/50 border border-border rounded-2xl rounded-tl-none p-4 shadow-sm text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className="py-10 text-center bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-dashed border-border">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">No activity yet</p>
                    </div>
                  )}

                  <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-4 focus-within:border-primary-500/50 transition-all shadow-premium">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-xs text-white font-black shadow-lg">
                        {user?.name?.[0] || 'U'}
                      </div>
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addComment()}
                        placeholder="Share your thoughts..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300"
                      />
                      <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl" onClick={addComment}>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-10">
              <div className="space-y-6 bg-slate-50 dark:bg-slate-950/50 border border-border rounded-[2.5rem] p-8">
                {editedTask.predictedCompletionTime && (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                       <span className="text-[10px] font-black uppercase tracking-widest">Smart Estimate</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Usually takes <span className="text-indigo-600">{editedTask.predictedCompletionTime}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</label>
                  <div className="relative">
                    <select 
                      value={editedTask.status}
                      onChange={(e) => handleUpdate({ status: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-border rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-black text-sm shadow-sm cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</label>
                  <div className="relative">
                    <select 
                      value={editedTask.categoryId || ''}
                      onChange={(e) => handleUpdate({ categoryId: e.target.value || null })}
                      className="w-full bg-white dark:bg-slate-900 border border-border rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-black text-sm shadow-sm cursor-pointer"
                    >
                      <option value="">No Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {editedTask.tags?.map(tag => (
                      <span key={tag.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-border text-[10px] font-black text-slate-600 dark:text-slate-400 shadow-sm group">
                        <Hash size={10} className="text-primary-500" />
                        {tag.name}
                        <button onClick={() => toggleTaskTag(tag)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <button 
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/50 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {showTagDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-xl p-3 space-y-1 overflow-hidden"
                      >
                        {tags.map(tag => {
                          const isAssigned = (editedTask.tags || []).some(t => t.id === tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => { toggleTaskTag(tag); setShowTagDropdown(false); }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isAssigned ? 'text-primary-600' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                              {tag.name}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {saving && (
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                    <Loader2 size={10} className="animate-spin" /> Synchronizing...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
