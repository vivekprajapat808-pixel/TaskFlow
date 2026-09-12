import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilter,
  selectSearchQuery,
  selectPriorityFilter,
  setFilter,
  setSearchQuery,
  setPriorityFilter,
} from '../features/tasks/tasksSlice';
import { Search } from 'lucide-react';

export default function TaskFilters() {
  const dispatch = useDispatch();
  const currentFilter = useSelector(selectFilter);
  const searchQuery = useSelector(selectSearchQuery);
  const priorityFilter = useSelector(selectPriorityFilter);

  return (
    <div className="controls-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or details..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          id="task-search-input"
        />
      </div>

      <div className="filters-row">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => dispatch(setFilter('all'))}
          >
            All
          </button>
          <button
            className={`filter-tab ${currentFilter === 'active' ? 'active' : ''}`}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active
          </button>
          <button
            className={`filter-tab ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => dispatch(setFilter('completed'))}
          >
            Completed
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="priority-filter" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Priority:
          </label>
          <select
            id="priority-filter"
            className="priority-select"
            value={priorityFilter}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
