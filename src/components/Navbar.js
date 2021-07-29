import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="justify-between mx-auto flex flex-wrap p-5 pb-0 flex-col md:flex-row items-center">
          <a className="no-underline flex title-font font-medium items-center text-gray-900 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <Link className='ml-3 text-xl no-underline text-gray-600 hover:text-gray-900' to="/Invoice">Scanner App</Link>
          </a>
          <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
            <Link className='no-underline mr-5 text-gray-600 hover:text-gray-900' to="/Invoice">Invoice</Link>
            <Link className='no-underline mr-5 text-gray-600 hover:text-gray-900' to="/Bank">Bank</Link>
            <Link className='no-underline mr-5 text-gray-600 hover:text-gray-900' to="/Login">Login</Link>
          </nav>
        </div>
      </header>
      <hr/>
    </div>
  );
};

export default Navbar;