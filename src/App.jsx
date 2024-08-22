import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './components/sidebar.jsx';
import Favourites from './Favourites/Favourites.jsx';
import ShowPreviews from './Explore/Preview.jsx';
import ShowDetails from './Explore/Details.jsx';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className='flex flex-row min-h-screen bg-spotify-dark text-white'>
        <SideBar menuOpen={menuOpen} onToggle={toggleMenu} />
        <div className='flex-1 p-7 overflow-x-hidden bg-spotify-dark-gray'>
          <Routes>
            <Route path='/' element={<ShowPreviews />} />
            <Route path='/Favourites' element={<Favourites />} />
            <Route path='/show/:id' element={<ShowDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
