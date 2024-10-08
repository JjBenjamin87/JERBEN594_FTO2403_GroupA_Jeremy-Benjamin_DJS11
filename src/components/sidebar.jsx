import React from 'react';
import { HiHome, HiHeart, HiMicrophone } from 'react-icons/hi'; // Importing icons for navigation
import { RxHamburgerMenu } from 'react-icons/rx'; // Importing hamburger menu icon for toggling sidebar
import { NavLink, Link } from 'react-router-dom'; // Importing routing components

const SideBar = ({ menuOpen, onToggle }) => {
  // Styles for active navigation link
  const activeStyles = {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: 'white',
  };

  return (
    <div
      className={`${
        menuOpen ? 'w-66' : 'w-20'
      } text-spotify-light bg-spotify-dark h-screen p-4 pt-6 relative duration-200`}
    >
      {/* Button to toggle the sidebar */}
      <button
        onClick={onToggle}
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 ${
          menuOpen ? 'border-transparent' : 'border-spotify-light'
        }`}
      >
        <RxHamburgerMenu className={`text-spotify-light ${menuOpen ? 'text-spotify-light' : 'text-spotify-dark'}`} />
      </button>

      {/* Link to the home page with a logo and title */}
      <Link to="/">
        <div className="flex gap-x-4 items-center">
          <HiMicrophone
            className={`text-spotify-green text-3xl cursor-pointer transition-transform duration-500 ${
              menuOpen ? 'block' : 'hidden'
            }`}
          />
          <p
            className={`text-spotify-green font-bold text-2xl origin-left transition-transform duration-200 ${
              menuOpen ? 'scale-100' : 'scale-0'
            }`}
          >
            Cast Hour<span className="text-spotify-light"> Group </span>
          </p>
        </div>
      </Link>

      {/* Navigation links */}
      <aside>
        {/* Link to the Explore page */}
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          <div
            className="text-3xl font-bold ml-6 px-4 md:px-14 flex flex-row justify-start items-center gap-3 cursor-pointer w-full hover:text-spotify-green transition-colors duration-300"
          >
            <HiHome />
            <p
              className={`origin-left py-5 px-0 transition-transform duration-400 ${
                menuOpen ? 'scale-100' : 'scale-0'
              }`}
            >
              Explore
            </p>
          </div>
        </NavLink>

        {/* Link to the Favourites page */}
        <NavLink
          to="/Favourites"
          style={({ isActive }) => (isActive ? activeStyles : null)}
        >
          <div
            className="text-3xl font-bold ml-6 px-4 md:px-14 flex flex-row justify-start items-center gap-3 cursor-pointer w-full hover:text-spotify-green transition-colors duration-300"
          >
            <HiHeart />
            <p
              className={`origin-left py-5 px-0 transition-transform duration-400 ${
                menuOpen ? 'scale-100' : 'scale-0'
              }`}
            >
              Favourites
            </p>
          </div>
        </NavLink>
      </aside>
    </div>
  );
};

export default SideBar;
