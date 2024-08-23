import React from 'react';
import { FaSearchengin } from 'react-icons/fa'; // Importing the search icon

const Searchbar = ({ handleInput, handleSearch }) => {
  return (
    <form
      className="flex items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        handleSearch(); // Call the search function passed as a prop
      }}
    >
      <input
        type="text"
        className="py-2 px-4 border rounded-md text-black bg-spotify-light placeholder-gray-500"
        placeholder="Search" // Placeholder text for the input field
        onChange={handleInput} // Call handleInput function on input change
      />
      <button
        type="submit"
        className="flex items-center justify-center py-2 px-4 bg-spotify-green text-white rounded-md hover:bg-spotify-dark transition-colors"
      >
        <FaSearchengin /> {/* Search icon inside the button */}
      </button>
    </form>
  );
};

export default Searchbar;
