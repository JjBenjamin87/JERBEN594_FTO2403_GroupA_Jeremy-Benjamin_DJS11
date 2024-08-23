import React, { useState, useEffect, useCallback } from 'react';
import FavSortFilters from './FavSortFilters'; // Component for sorting and filtering favorites
import { HiArrowLeft } from 'react-icons/hi'; // Importing the left arrow icon for navigation
import { Link } from 'react-router-dom'; // Importing Link component for routing

// Function to group episodes by their show title
const groupEpisodesByShow = (favorites) => {
  return favorites.reduce((acc, favEpisode) => {
    const { showTitle, ...episodeDetails } = favEpisode;
    if (!acc[showTitle]) {
      acc[showTitle] = { showTitle, episodes: [] };
    }
    acc[showTitle].episodes.push(episodeDetails);
    return acc;
  }, {});
};

const Favourites = () => {
  // State to manage filtered favorites and sort type
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [sortType, setSortType] = useState('all');

  // Effect hook to load favorites from localStorage when component mounts
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFilteredFavorites(favorites);
  }, []);

  // Callback to handle deletion of a favorite episode
  const handleDeleteEpisode = useCallback((index) => {
    const newFavorites = filteredFavorites.filter((_, i) => i !== index);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFilteredFavorites(newFavorites);
  }, [filteredFavorites]);

  // Callback to handle sorting and filtering of favorites based on filter type
  const handleFavePageFilter = useCallback((filterType) => {
    let sortedFavorites = [...filteredFavorites];
    switch (filterType) {
      case 'A-Z':
        sortedFavorites.sort((a, b) => a.showTitle.localeCompare(b.showTitle));
        break;
      case 'Z-A':
        sortedFavorites.sort((a, b) => b.showTitle.localeCompare(a.showTitle));
        break;
      case 'Newest':
        sortedFavorites.sort((a, b) => new Date(b.seasonUpdated) - new Date(a.seasonUpdated));
        break;
      case 'Oldest':
        sortedFavorites.sort((a, b) => new Date(a.seasonUpdated) - new Date(b.seasonUpdated));
        break;
      default:
        break;
    }
    setFilteredFavorites(sortedFavorites);
    setSortType(filterType);
  }, [filteredFavorites]);

  // Group favorites by show title
  const groupedFavoritesEpisode = Object.values(groupEpisodesByShow(filteredFavorites));

  return (
    <div className='text-white'>
      {/* Link to navigate back to the main shows page */}
      <Link to="/" relative="path">
        <HiArrowLeft className="bg-spotify-green text-5xl rounded-full text-white hover:bg-spotify-dark-gray" />
        <span className='text-white'>Back to all shows</span>
      </Link>
      
      {/* Title of the favorites page */}
      <h2 className='text-3xl text-white mt-4 font-extrabold mb-4 md:text-5xl'>Favourites episodes</h2>
      
      {/* Filter component for sorting and filtering favorites */}
      <FavSortFilters handleFavePageFilter={handleFavePageFilter} />
      
      {/* List of grouped favorite episodes */}
      <ul className='space-y-4 mt-8'>
        {groupedFavoritesEpisode.map((group) => (
          <li key={group.showTitle} className='flex flex-col'>
            {/* Show title */}
            <h3 className='text-xl font-bold text-spotify-green'>{group.showTitle}</h3>
            {/* Display the most recent season update */}
            <h4>{group.episodes[0]?.seasonUpdated || 'N/A'}</h4>
            {/* List of episodes for the current show */}
            <ul className='space-y-2'>
              {group.episodes.map((favEpisode, index) => (
                <li key={index} className='flex items-center'>
                  {/* Episode title */}
                  <span>{favEpisode.episodeTitle}</span>
                  {/* Date when the episode was added to favorites */}
                  <span className='text-white-750 ml-4 mr-3'>(Added: {favEpisode.addedDate})</span>
                  {/* Audio player for the episode */}
                  <audio className='ml-auto' controls>
                    <source src={favEpisode.episodeAudio} type='audio/mp3' />
                    Your browser does not support the audio element.
                  </audio>
                  {/* Button to delete the episode from favorites */}
                  <button
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-8 rounded'
                    onClick={() => handleDeleteEpisode(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favourites;
