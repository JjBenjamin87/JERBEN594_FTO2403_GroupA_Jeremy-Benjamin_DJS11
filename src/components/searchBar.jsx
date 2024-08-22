import React from 'react';
import { FaSearchengin } from 'react-icons/fa';

const Searchbar = ({ handleInput, handleSearch }) => {
  return (
    <form
      className="flex items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <input
        type="text"
        className="py-2 px-4 border rounded-md text-black bg-spotify-light placeholder-gray-500"
        placeholder="Search"
        onChange={handleInput}
      />
      <button
        type="submit"
        className="flex items-center justify-center py-2 px-4 bg-spotify-green text-white rounded-md hover:bg-spotify-dark transition-colors"
      >
        <FaSearchengin />
      </button>
    </form>
  );
};

export default Searchbar;
