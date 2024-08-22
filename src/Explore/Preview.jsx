import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Filters from '../components/filters.jsx';
import Searchbar from '../components/searchBar.jsx'; // Although it's not used in this component

const ShowPreviews = () => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortedPreviews, setSortedPreviews] = useState([]);
  
  const genres = [
    "Personal Growth",
    "True Crime and Investigative Journalism",
    "History",
    "Comedy",
    "Entertainment",
    "Business",
    "Fiction",
    "News",
    "Kids and Family",
  ];

  useEffect(() => {
    const fetchPreviews = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) throw new Error("Data Fetching Failed");

        const data = await response.json();
        setPreviews(data);
        setSortedPreviews(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviews();
  }, []);

  useEffect(() => {
    setSortedPreviews(previews);
  }, [previews]);

  const handleFilter = (event) => {
    const filterType = event.target.innerText;
    const sortedData = [...sortedPreviews].sort((a, b) => {
      switch (filterType) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        case "Newest":
          return new Date(b.updated) - new Date(a.updated);
        case "Oldest":
          return new Date(a.updated) - new Date(b.updated);
        default:
          return 0;
      }
    });

    setSortedPreviews(sortedData);
  };

  const handleGenreUpdate = (genre) => {
    const filteredPreviews = genre && genre !== "All"
      ? previews.filter((show) => show.genres.includes(genre))
      : previews;
    
    setSortedPreviews(filteredPreviews);
  };

  if (error) return <h1 className='text-red-600 font-bold'>{error.message}</h1>;
  if (loading) return <h1 className='text-white font-bold text-2xl justify-center items-center'>Loading</h1>;

  return (
    <>
      <h1 className='font-bold text-white text-4xl mb-10 md:text-6xl ml-8'>
        Welcome to <span className='text-[#1DB954]'>Cast Hour</span> Podcast
      </h1>
      <Filters 
        handleGenreUpdate={handleGenreUpdate}
        genres={genres}
        handleFilter={handleFilter}
      />
      <ul className='list-none flex flex-wrap ml-8 text-white gap-8 justify-start'>
        {sortedPreviews.map((preview) => (
          <Link key={preview.id} to={`/show/${preview.id}`}>
            <li className='relative no-underline bg-[#282828] max-w-[220px] h-[360px] flex flex-col justify-between items-center p-4 rounded-md shadow-[0 0 16px 0 rgba(0, 0, 0, 0.5)] hover:cursor-pointer hover:translate-y-[-4px] hover:transition-all hover:shadow-[0 0 20px 0 rgba(0, 0, 0, 0.7)] overflow-hidden'>
              <div>
                <img 
                  src={preview.image} 
                  width={174}
                  height={174}
                  alt={preview.title}
                  className='aspect-square w-full h-full rounded-md'
                />
              </div>
              <div className='flex flex-col justify-between w-full mt-4'>
                <p className='truncate font-bold text-lg'>{preview.title}</p>
                <p className='text-gray-400 text-sm line-clamp-2'>{preview.description}</p>
                <div className='flex justify-between text-xs'>
                  <p><span className='font-semibold'>Seasons:</span> {preview.seasons}</p>
                  <p><span className='font-semibold'>Genres:</span> {preview.genres.length}</p>
                </div>
                <p className='text-gray-500 text-xs mt-2'>
                  <span className='font-semibold'>Last Updated:</span> {preview.updated.slice(0,10)}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default ShowPreviews;
