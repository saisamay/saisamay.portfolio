import { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'About', path: '/about' },
  { label: 'Skills', path: '/skills' },
  { label: 'Experience', path: '/experience' },
  { label: 'Projects', path: '/projects' },
  { label: 'Certifications', path: '/certifications' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          {/* ==================== BRAND ==================== */}

          <div className="navbar-brand">
            <Link to="/" aria-label="Go to home">
              <img
                src="/Assets/samay.gif"
                alt="Sai Samay"
                className="logo-img"
              />
            </Link>
          </div>

          {/* ==================== DESKTOP NAVIGATION ==================== */}

          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="navbar-link"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ==================== RESUME ==================== */}

          <a
            href="/Assets/Sai_Samay_Resume.pdf"
            className="resume-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>

          {/* ==================== MOBILE MENU ==================== */}

          <button
            className="menu-button"
            onClick={openSidebar}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              viewBox="0 -960 960 960"
              aria-hidden="true"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>

        </div>
      </nav>

      {/* ==================== MOBILE SIDEBAR ==================== */}

      <ul
        className={`sidebar ${sidebarOpen ? 'active' : ''}`}
        aria-hidden={!sidebarOpen}
      >

        <li className="sidebar-close">
          <button
            id="close-sidebar"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              viewBox="0 -960 960 960"
              aria-hidden="true"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </li>

        <li>
          <Link to="/" onClick={closeSidebar}>
            Home
          </Link>
        </li>

        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={closeSidebar}
            >
              {item.label}
            </Link>
          </li>
        ))}

        <li>
          <a
            href="/Assets/Sai_Samay_Resume.pdf"
            onClick={closeSidebar}
          >
            Download Resume
          </a>
        </li>

      </ul>

      {/* ==================== SIDEBAR OVERLAY ==================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;