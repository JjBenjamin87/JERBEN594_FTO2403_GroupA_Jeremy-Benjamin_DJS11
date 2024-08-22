import React, { useState, useEffect } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

const FavouriteButton = ({ id, addToFavorites }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Initialize favorite state here if needed
    // Example: check if `id` is in the list of favorites from local storage or context
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite((prevState) => {
      const newState = !prevState;
      if (newState) {
        addToFavorites();
      }
      return newState;
    });
  };

  return (
    <button
      id={id}
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={`p-2 rounded-full transition-transform duration-300 ease-in-out 
        ${isFavorite ? 'bg-[#1DB954] text-white hover:scale-110' : 'bg-[#282828] text-[#B3B3B3] hover:scale-110'}`}
    >
      {isFavorite ? (
        <HiHeart className="text-2xl" />
      ) : (
        <HiOutlineHeart className="text-2xl" />
      )}
    </button>
  );
};

export default FavouriteButton;

