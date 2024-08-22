import React from 'react';

// Reusable button component
const FilterButton = ({ onClick, children, isActive }) => (
  <button
  className={`py-2 px-4 rounded-md transition-colors 
    ${isActive ? 'bg-spotify-green text-spotify-dark' : 'bg-spotify-green text-spotify-dark'}
    hover:bg-spotify-dark hover:text-spotify-green focus:bg-spotify-dark focus:text-spotify-green`}
  onClick={onClick}
  >
    {children}
  </button>
);

const Filters = ({ genres, handleFilter, handleGenreUpdate }) => {
  const [selectedGenre, setSelectedGenre] = React.useState("All");
  const [selectedFilter, setSelectedFilter] = React.useState('all'); // To track the active filter

  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setSelectedGenre(newGenre);
    handleGenreUpdate(newGenre);
  };

  return (
    <div className="flex gap-4 mb-11 ml-8 mt-10">
      <FilterButton onClick={() => { handleFilter('all'); setSelectedFilter('all'); }} isActive={selectedFilter === 'all'}>All</FilterButton>
      <FilterButton onClick={() => { handleFilter('a-z'); setSelectedFilter('a-z'); }} isActive={selectedFilter === 'a-z'}>A-Z</FilterButton>
      <FilterButton onClick={() => { handleFilter('z-a'); setSelectedFilter('z-a'); }} isActive={selectedFilter === 'z-a'}>Z-A</FilterButton>
      <FilterButton onClick={() => { handleFilter('newest'); setSelectedFilter('newest'); }} isActive={selectedFilter === 'newest'}>Newest</FilterButton>
      <FilterButton onClick={() => { handleFilter('oldest'); setSelectedFilter('oldest'); }} isActive={selectedFilter === 'oldest'}>Oldest</FilterButton>

      <select
        className="bg-spotify-dark text-spotify-light py-2 px-4 rounded-md transition-colors hover:bg-spotify-dark focus:bg-spotify-dark"
        value={selectedGenre}
        onChange={handleGenreChange}
      >
        <option value="All">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
