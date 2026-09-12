import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectFilteredTasks,
  selectTasksStatus,
  selectTasksError,
} from '../features/tasks/tasksSlice';
import TaskItem from './TaskItem';
import { ClipboardList, AlertTriangle, Loader2 } from 'lucide-react';

export default function TaskList({ onEdit, onOpenNewModal }) {
  const tasks = useSelector(selectFilteredTasks);
  const status = useSelector(selectTasksStatus);
  const error = useSelector(selectTasksError);

  if (status === 'loading' && tasks.length === 0) {
    return (
      <div className="empty-state">
        <Loader2 className="empty-icon" style={{ animation: 'spin 1s linear infinite' }} size={36} />
        <h3>Loading your tasks...</h3>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="empty-state" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
        <div className="empty-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
          <AlertTriangle size={32} />
        </div>
        <h3 style={{ color: '#ef4444' }}>Failed to load tasks</h3>
        <p style={{ marginTop: '6px' }}>{error || 'Make sure the Express server is running.'}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <ClipboardList size={32} />
        </div>
        <h3>No tasks found</h3>
        <p style={{ margin: '8px 0 20px', color: 'var(--text-muted)' }}>
          No tasks match your current search or filter criteria.
        </p>
        <button className="btn btn-primary" onClick={onOpenNewModal}>
          Create a New Task
        </button>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}
