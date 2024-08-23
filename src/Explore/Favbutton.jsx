import React, { useState, useEffect } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'; // Import heart icons for favorite state

const FavouriteButton = ({ id, addToFavorites }) => {
  // State to track whether the item is favorited or not
  const [isFavorite, setIsFavorite] = useState(false);

  // Effect hook to initialize favorite state if needed
  useEffect(() => {
    // Initialize favorite state here if needed
    // For example, check if `id` is in the list of favorites from local storage or context
    
  }, [id]); // Depend on `id` so the effect runs when `id` changes

  // Toggle the favorite state
  const toggleFavorite = () => {
    setIsFavorite((prevState) => {
      const newState = !prevState; // Toggle the state
      if (newState) {
        addToFavorites(); // Call the function to add to favorites if the new state is true
      }
      return newState; // Return the new state
    });
  };

  return (
    <button
      id={id} // Set button ID to the provided `id` prop
      onClick={toggleFavorite} // Handle click to toggle favorite state
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} // Accessibility label for screen readers
      className={`p-2 rounded-full transition-transform duration-300 ease-in-out 
        ${isFavorite ? 'bg-[#1DB954] text-white hover:scale-110' : 'bg-[#282828] text-[#B3B3B3] hover:scale-110'}`} 
      // Button styles: different colors and hover effects based on favorite state
    >
      {isFavorite ? (
        <HiHeart className="text-2xl" /> // Display filled heart icon if item is favorited
      ) : (
        <HiOutlineHeart className="text-2xl" /> // Display outlined heart icon if item is not favorited
      )}
    </button>
  );
};

export default FavouriteButton;
