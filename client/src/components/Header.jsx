import React from 'react';
import { CheckSquare, Plus, Sparkles } from 'lucide-react';

export default function Header({ onOpenNewModal }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <CheckSquare size={26} strokeWidth={2.4} />
        </div>
        <div>
          <h1 className="brand-title">TaskFlow</h1>
          <p className="brand-subtitle">{currentDate} • React + Redux Edition</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={onOpenNewModal} id="create-task-btn">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
