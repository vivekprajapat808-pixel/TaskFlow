import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTaskDone, deleteTask } from '../features/tasks/tasksSlice';
import { Check, Calendar, Edit3, Trash2, AlertCircle } from 'lucide-react';

export default function TaskItem({ task, onEdit }) {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTaskDone(task.id));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      dispatch(deleteTask(task.id));
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`task-item ${task.isDone ? 'completed' : ''}`}>
      <button
        className={`check-btn ${task.isDone ? 'checked' : ''}`}
        onClick={handleToggle}
        title={task.isDone ? 'Mark as active' : 'Mark as completed'}
        aria-label="Toggle task completion"
      >
        {task.isDone && <Check size={16} strokeWidth={3} />}
      </button>

      <div className="task-content">
        <h3 className={`task-title ${task.isDone ? 'strikethrough' : ''}`}>
          {task.title}
        </h3>

        {task.details && (
          <p className={`task-details ${task.isDone ? 'strikethrough' : ''}`}>
            {task.details}
          </p>
        )}

        <div className="task-meta">
          <span className={`badge badge-${task.priority || 'medium'}`}>
            {task.priority || 'medium'}
          </span>

          {task.dueDate && (
            <span className="date-badge">
              <Calendar size={13} />
              <span>{formatDueDate(task.dueDate)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn btn-icon"
          onClick={() => onEdit(task)}
          title="Edit Task"
          aria-label="Edit task"
        >
          <Edit3 size={17} />
        </button>
        <button
          className="btn btn-icon"
          onClick={handleDelete}
          title="Delete Task"
          aria-label="Delete task"
          style={{ color: '#f87171' }}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
