import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavouriteButton from './Favbutton.jsx';
import { v4 as uuidv4 } from 'uuid';
import { HiArrowLeft } from 'react-icons/hi'; // Importing the left arrow icon for navigation

const ShowDetails = ({ menuOpen }) => {
  // Extract the show ID from the URL parameters
  const { id } = useParams();

  // State variables to manage component's data and UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState({
    title: '',
    description: '',
    updated: '',
    genres: [],
    image: '',
    seasons: []
  });
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [slicedSeasons, setSlicedSeasons] = useState([]);
  const [playingEpisode, setPlayingEpisode] = useState(null);

  // Effect hook to fetch show details from the API when the component mounts or the ID changes
  useEffect(() => {
    const fetchShowDetails = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) throw new Error('Data Fetching Failed'); // Handle API errors
        const data = await response.json();
        console.log('Fetched data:', data); // Debugging: log the fetched data
        setShow(data); // Update state with the fetched show data
        setSelectedSeason(data.seasons[0]); // Set the first season as the default selected season
        setSlicedSeasons(data.seasons.slice(0, 5)); // Initialize the sliced seasons for "Show More" functionality
      } catch (err) {
        setError(err); // Set error state if there is an issue fetching data
      } finally {
        setLoading(false); // Set loading to false when fetching is done
      }
    };
    fetchShowDetails();
  }, [id]); // Depend on `id` so the effect re-runs when `id` changes

  // Callback to handle the selection of a season
  const handleSeasonSelect = useCallback((season) => {
    setSelectedSeason((prevSeason) => (season === prevSeason ? null : season)); // Toggle season selection
    setPlayingEpisode(null); // Reset the playing episode when changing seasons
  }, []);

  // Callback to toggle between showing all seasons or just a few
  const handleShowMoreClick = useCallback(() => {
    setShowAll((prevShowAll) => !prevShowAll); // Toggle the `showAll` state
  }, []);

  // Function to add an episode to favorites
  const addToFavorites = useCallback((episode) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Get existing favorites from localStorage
    const newEpisode = {
      showTitle: show.title,
      seasonUpdated: show.updated,
      seasonTitle: selectedSeason ? selectedSeason.title : 'N/A',
      episodeTitle: episode.title,
      episodeAudio: episode.file,
      addedDate: new Date().toLocaleString(), // Current date and time
    };

    // Check if the episode is already in favorites
    const isInFavorites = favorites.some(
      (favEpisode) =>
        favEpisode.showTitle === newEpisode.showTitle &&
        favEpisode.seasonUpdated === newEpisode.seasonUpdated &&
        favEpisode.seasonTitle === newEpisode.seasonTitle &&
        favEpisode.episodeTitle === newEpisode.episodeTitle &&
        favEpisode.episodeAudio === newEpisode.episodeAudio
    );

    if (!isInFavorites) {
      favorites.push(newEpisode); // Add the new episode to favorites if not already present
      localStorage.setItem('favorites', JSON.stringify(favorites)); // Save updated favorites to localStorage
    }
  }, [show, selectedSeason]); // Depend on `show` and `selectedSeason`

  // Conditional rendering based on loading and error states
  if (error) return <h1 className="text-red-500 font-bold text-center mt-10">{error.message}</h1>;
  if (loading) return <h1 className="text-white font-bold text-2xl text-center mt-10">Loading...</h1>;

  // Determine which seasons to display based on `showAll` state
  const visibleSeasons = showAll ? show.seasons : slicedSeasons;

  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Link to navigate back to the list of all shows */}
      <Link to="/" className="flex items-center text-white mb-6 sm:mb-8 hover:text-green-500 transition-colors">
        <HiArrowLeft className="text-2xl sm:text-3xl" />
        <span className="ml-2 sm:ml-4">Back to all shows</span>
      </Link>

      {/* Display show details */}
      {show && (
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Show image and basic information */}
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <img className="w-full sm:w-48 md:w-56 lg:w-64 h-auto rounded-md object-cover" src={show.image} alt={show.title} />
            <div className="bg-[#121212] rounded-md p-4 sm:p-6 flex flex-col justify-between">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4">{show.title}</h1>
              <p className="text-gray-400 mb-2 sm:mb-4">{show.description}</p>
              <p className="text-green-500 mb-2">
                <span className="font-semibold">Last updated: </span>
                {show.updated && typeof show.updated === 'string' ? show.updated.slice(0, 10) : 'N/A'}
              </p>
              <p className="text-gray-400">
                <span className="font-semibold">Genres: </span>
                {show.genres && Array.isArray(show.genres) ? show.genres.join(', ') : 'N/A'}
              </p>
            </div>
          </div>

          {/* Show list of seasons */}
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="w-full md:w-1/3">
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-4">Seasons</h3>
              <ul className="list-none">
                {visibleSeasons.map((season) => (
                  <li
                    key={season.season}
                    onClick={() => handleSeasonSelect(season)}
                    className="cursor-pointer mb-2 px-3 py-2 rounded-md transition-colors hover:bg-gray-800 hover:text-green-500"
                  >
                    <div className="flex items-center">
                      <img
                        src={season.image}
                        alt={season.title}
                        width={40}
                        height={16}
                        className="mr-2 rounded-md"
                      />
                      <span>{season.title} ({season.episodes && Array.isArray(season.episodes) ? season.episodes.length : 0} episodes)</span>
                    </div>
                  </li>
                ))}
                <li
                  className="cursor-pointer text-blue-500"
                  onClick={handleShowMoreClick}
                >
                  {showAll ? 'Hide' : 'Show More'}
                </li>
              </ul>
            </div>

            {/* Show list of episodes for the selected season */}
            <div className="w-full md:w-2/3">
              <ul className="list-none">
                {selectedSeason && Array.isArray(selectedSeason.episodes) && selectedSeason.episodes.map((episode) => (
                  <li
                    key={episode.title}
                    className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 py-2 sm:py-4 cursor-pointer"
                    onClick={() => {
                      console.log('Episode clicked:', episode); // Debugging: log the clicked episode
                      setPlayingEpisode(episode); // Set the clicked episode as the currently playing episode
                    }}
                  >
                    <div className="flex-grow pr-2 sm:pr-4">
                      <p className="text-yellow-400 font-bold text-lg sm:text-xl mb-1">{episode.title}</p>
                      <p className="text-gray-400 line-clamp-2">{episode.description}</p>
                    </div>
                    <FavouriteButton
                      key={uuidv4()}
                      id={uuidv4()}
                      addToFavorites={() => addToFavorites(episode)}
                    />
                  </li>
                ))}
              </ul>

              {/* Show audio player if an episode is currently playing */}
              {playingEpisode && (
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-xs">
                    <h4 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Now Playing: {playingEpisode.title}</h4>
                    <audio controls className="w-full bg-[#121212] rounded-md">
                      <source src={playingEpisode.file} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDetails;
