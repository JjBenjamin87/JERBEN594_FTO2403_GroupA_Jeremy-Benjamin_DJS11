import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavouriteButton from './Favbutton.jsx';
import { v4 as uuidv4 } from 'uuid';
import { HiArrowLeft } from 'react-icons/hi'; // Correct icon import

const ShowDetails = ({ menuOpen }) => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchShowDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) throw new Error('Data Fetching Failed');
        const data = await response.json();
        console.log('Fetched data:', data); // Log the data structure
        setShow(data);
        setSelectedSeason(data.seasons[0]);
        setSlicedSeasons(data.seasons.slice(0, 5));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [id]);

  const handleSeasonSelect = useCallback((season) => {
    setSelectedSeason((prevSeason) => (season === prevSeason ? null : season));
    setPlayingEpisode(null); // Reset playing episode when changing seasons
  }, []);

  const handleShowMoreClick = useCallback(() => {
    setShowAll((prevShowAll) => !prevShowAll);
  }, []);

  const addToFavorites = useCallback((episode) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const newEpisode = {
      showTitle: show.title,
      seasonUpdated: show.updated,
      seasonTitle: selectedSeason ? selectedSeason.title : 'N/A',
      episodeTitle: episode.title,
      episodeAudio: episode.file,
      addedDate: new Date().toLocaleString(),
    };

    const isInFavorites = favorites.some(
      (favEpisode) =>
        favEpisode.showTitle === newEpisode.showTitle &&
        favEpisode.seasonUpdated === newEpisode.seasonUpdated &&
        favEpisode.seasonTitle === newEpisode.seasonTitle &&
        favEpisode.episodeTitle === newEpisode.episodeTitle &&
        favEpisode.episodeAudio === newEpisode.episodeAudio
    );

    if (!isInFavorites) {
      favorites.push(newEpisode);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [show, selectedSeason]);

  if (error) return <h1 className="text-red-500 font-bold text-center mt-10">{error.message}</h1>;
  if (loading) return <h1 className="text-white font-bold text-2xl text-center mt-10">Loading...</h1>;

  const visibleSeasons = showAll ? show.seasons : slicedSeasons;

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <Link to="/" className="flex items-center text-white mb-8 hover:text-green-500 transition-colors">
        <HiArrowLeft className="text-3xl" />
        <span className="ml-4">Back to all shows</span>
      </Link>

      {show && (
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-col md:flex-row gap-6">
            <img className="w-48 h-48 rounded-md object-cover" src={show.image} alt={show.title} />
            <div className="bg-[#121212] rounded-md p-6 flex flex-col justify-between">
              <h1 className="text-4xl font-extrabold mb-4">{show.title}</h1>
              <p className="text-gray-400 mb-4">{show.description}</p>
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

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <h3 className="text-3xl font-extrabold mb-4">Seasons</h3>
              <ul className="list-none">
                {visibleSeasons.map((season) => (
                  <li
                    key={season.season}
                    onClick={() => handleSeasonSelect(season)}
                    className="cursor-pointer mb-2 px-4 py-2 rounded-md transition-colors hover:bg-gray-800 hover:text-green-500"
                  >
                    <div className="flex items-center">
                      <img
                        src={season.image}
                        alt={season.title}
                        width={50}
                        height={20}
                        className="mr-3 rounded-md"
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

            <div className="w-full md:w-2/3">
              <ul className="list-none">
                {selectedSeason && Array.isArray(selectedSeason.episodes) && selectedSeason.episodes.map((episode) => (
                  <li
                    key={episode.title}
                    className="flex justify-between items-center border-b border-gray-700 py-4 cursor-pointer"
                    onClick={() => {
                      console.log('Episode clicked:', episode); // Debugging log
                      setPlayingEpisode(episode);
                    }}
                  >
                    <div className="flex-grow pr-4">
                      <p className="text-yellow-400 font-bold text-xl mb-1">{episode.title}</p>
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

              {playingEpisode && (
                <div className="mt-8 flex justify-center">
                  <div className="w-full max-w-xs">
                    <h4 className="text-2xl font-semibold mb-4 text-center">Now Playing: {playingEpisode.title}</h4>
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
