import React from 'react';
import { useSelector } from 'react-redux';
import { selectTaskStats } from '../features/tasks/tasksSlice';
import { CheckCircle2, Clock, Flame, ListTodo } from 'lucide-react';

export default function TaskStats() {
  const stats = useSelector(selectTaskStats);

  return (
    <div className="stats-grid">
      <div className="stat-item">
        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
          <ListTodo size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="stat-val">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <CheckCircle2 size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="stat-val">{stats.completed}</div>
          <div className="stat-label">Completed ({stats.completionRate}%)</div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${stats.completionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
          <Clock size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="stat-val">{stats.active}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
          <Flame size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="stat-val">{stats.highPriority}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>
    </div>
  );
}
