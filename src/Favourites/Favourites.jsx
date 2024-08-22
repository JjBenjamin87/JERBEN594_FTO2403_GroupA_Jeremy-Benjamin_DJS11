import React, { useState, useEffect, useCallback } from 'react';
import FavSortFilters from './FavSortFilters';
import { HiArrowLeft } from 'react-icons/hi'; // Use HiArrowLeft instead
import { Link } from 'react-router-dom';

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
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [sortType, setSortType] = useState('all');

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFilteredFavorites(favorites);
  }, []);

  const handleDeleteEpisode = useCallback((index) => {
    const newFavorites = filteredFavorites.filter((_, i) => i !== index);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFilteredFavorites(newFavorites);
  }, [filteredFavorites]);

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

  const groupedFavoritesEpisode = Object.values(groupEpisodesByShow(filteredFavorites));

  return (
    <div className='text-white'>
      <Link to="/" relative="path">
        <HiArrowLeft className="bg-spotify-green text-5xl rounded-full text-white hover:bg-spotify-dark-gray" />
        <span className='text-white'>Back to all shows</span>
      </Link>
      <h2 className='text-3xl text-white mt-4 font-extrabold mb-4 md:text-5xl'>Favourites episodes</h2>
      <FavSortFilters handleFavePageFilter={handleFavePageFilter} />
      <ul className='space-y-4 mt-8'>
        {groupedFavoritesEpisode.map((group) => (
          <li key={group.showTitle} className='flex flex-col'>
            <h3 className='text-xl font-bold text-spotify-green'>{group.showTitle}</h3>
            <h4>{group.episodes[0]?.seasonUpdated || 'N/A'}</h4>
            <ul className='space-y-2'>
              {group.episodes.map((favEpisode, index) => (
                <li key={index} className='flex items-center'>
                  <span>{favEpisode.episodeTitle}</span>
                  <span className='text-white-750 ml-4 mr-3'>(Added: {favEpisode.addedDate})</span>
                  <audio className='ml-auto' controls>
                    <source src={favEpisode.episodeAudio} type='audio/mp3' />
                    Your browser does not support the audio element.
                  </audio>
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
