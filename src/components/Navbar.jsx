import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <nav>
        <ul className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <li>
            <a id="close-sidebar" href="#" onClick={(e) => { e.preventDefault(); closeSidebar(); }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </a>
          </li>
          <li><Link to="/" onClick={closeSidebar}>Home</Link></li>
          <li><Link to="/projects" onClick={closeSidebar}>Projects</Link></li>
          <li><Link to="/about" onClick={closeSidebar}>About</Link></li>
          <li><Link to="/contact" onClick={closeSidebar}>Contact</Link></li>
        </ul>
        <ul>
          <li className="logo">
            <Link to="/">
              <img src="/Assets/samay.gif" alt="Sai Samay Portfolio Home" className="logo-img" />
            </Link>
          </li>
          <li className="hideOnMobile nav-link"><Link to="/projects">Projects</Link></li>
          <li className="hideOnMobile nav-link"><Link to="/about">About</Link></li>
          <li className="hideOnMobile nav-link"><Link to="/contact">Contact</Link></li>
          <li className="menu-button">
            <a id="hamburger-menu" href="#" onClick={(e) => { e.preventDefault(); toggleSidebar(); }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
      {sidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
    </>
  );
};

export default Navbar;
