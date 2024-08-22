import React from 'react';

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'A-Z', value: 'a-z' },
  { label: 'Z-A', value: 'z-a' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
];

const FavSortFilters = ({ handleFavePageFilter, selectedFilter }) => {
  return (
    <div className="flex gap-2">
      {FILTER_OPTIONS.map(({ label, value }) => (
        <button
          key={value}
          className={`py-2 px-4 rounded-md transition-colors 
            ${value === selectedFilter ? 'text-spotify-green bg-spotify-dark' : 'text-spotify-light bg-spotify-dark'}
            hover:bg-spotify-dark-gray focus:bg-spotify-dark-gray
            ${value === selectedFilter ? 'focus:text-spotify-green' : ''}
          `}
          onClick={() => handleFavePageFilter(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FavSortFilters;
