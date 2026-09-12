import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../features/tasks/tasksSlice';
import { X } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, editingTask }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDetails(editingTask.details || '');
      setPriority(editingTask.priority || 'medium');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '');
    } else {
      setTitle('');
      setDetails('');
      setPriority('medium');
      setDueDate('');
    }
    setErrorMsg('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a task title');
      return;
    }

    if (editingTask) {
      await dispatch(
        updateTask({
          id: editingTask.id,
          title: title.trim(),
          details: details.trim(),
          priority,
          dueDate: dueDate || null,
        })
      );
    } else {
      await dispatch(
        addTask({
          title: title.trim(),
          details: details.trim(),
          priority,
          dueDate: dueDate || null,
        })
      );
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="modal-task-title">Task Title *</label>
            <input
              id="modal-task-title"
              type="text"
              className="form-input"
              placeholder="e.g. Complete quarterly documentation"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-task-details">Details / Notes</label>
            <textarea
              id="modal-task-details"
              className="form-textarea"
              rows={4}
              placeholder="Add extra context, checklists, or links..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-task-priority">Priority</label>
              <select
                id="modal-task-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-task-duedate">Due Date</label>
              <input
                id="modal-task-duedate"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="modal-submit-btn">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
