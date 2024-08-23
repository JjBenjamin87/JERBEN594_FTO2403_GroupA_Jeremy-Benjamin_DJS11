import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Filters from '../components/filters.jsx';
import Searchbar from '../components/searchBar.jsx'; // Ensure this is the correct path
import Fuse from 'fuse.js'; // Import Fuse.js

const ShowPreviews = () => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortedPreviews, setSortedPreviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Memoize fuse instance to avoid re-creating it on every render
  const fuse = useMemo(() => new Fuse(previews, {
    keys: ['title', 'description'],
    includeScore: true,
    threshold: 0.3,
  }), [previews]);

  useEffect(() => {
    const results = searchQuery
      ? fuse.search(searchQuery).map(result => result.item)
      : previews;

    setSortedPreviews(results);
  }, [searchQuery, previews, fuse]);

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

  if (error) return <h1 className='text-red-600 font-bold text-center'>{error.message}</h1>;

  // Use skeleton loaders or a spinner for a better loading experience
  if (loading) return (
    <div className='text-white font-bold text-2xl text-center'>
      <div className='animate-pulse space-y-4'>
        <div className='h-8 bg-gray-700 rounded w-3/4 mx-auto'></div>
        <div className='h-6 bg-gray-600 rounded w-1/2 mx-auto'></div>
        <div className='h-6 bg-gray-600 rounded w-2/3 mx-auto'></div>
      </div>
    </div>
  );

  return (
    <>
      <h1 className='font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 mx-4 sm:mx-6 md:mx-8 lg:mx-10'>
        Welcome to <span className='text-[#1DB954]'>Cast Hour</span> Podcast
      </h1>
      <div className="mb-4 mx-4 sm:mx-6 md:mx-8 lg:mx-10">
        <Searchbar
          handleInput={(e) => setSearchQuery(e.target.value)}
          handleSearch={() => {}}
        />
      </div>
      <Filters 
        handleGenreUpdate={handleGenreUpdate}
        genres={genres}
        handleFilter={handleFilter}
      />
      <ul className='list-none flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-start'>
        {sortedPreviews.map((preview) => (
          <Link key={preview.id} to={`/show/${preview.id}`}>
            <li className='relative no-underline bg-[#282828] max-w-[220px] w-full sm:max-w-[300px] md:max-w-[340px] lg:max-w-[400px] h-[360px] flex flex-col justify-between items-center p-4 rounded-md shadow-lg hover:cursor-pointer hover:translate-y-[-4px] hover:transition-transform hover:shadow-xl overflow-hidden'>
              <div className='w-full h-36 sm:h-44 md:h-52 lg:h-60'>
                <img 
                  src={preview.image} 
                  width={174}
                  height={174}
                  alt={preview.title}
                  className='object-cover w-full h-full rounded-md'
                  loading='lazy'
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
