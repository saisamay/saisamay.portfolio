import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerRef = useRef(null);
  const cursorRef = useRef(null);
  const [cursorStyle, setCursorStyle] = useState({ opacity: 0, transform: 'scale(0)', left: 0, top: 0 });

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Intersection Observer for Nav theme
    const root = document.documentElement;
    const defaultTheme = { '--nav-link-bg': 'transparent', '--nav-hover-fill': '#F5A045', '--hamburger-hover-bg': '#F5A045' };
    const footerTheme = { '--nav-link-bg': '#F5A045', '--nav-hover-fill': '#fff', '--hamburger-hover-bg': '#fff' };

    const applyNavTheme = (theme) => {
      for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          applyNavTheme(footerTheme);
        } else {
          applyNavTheme(defaultTheme);
        }
      });
    }, { root: null, rootMargin: '0px 0px -95% 0px', threshold: 0 });

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '1';
      cursorRef.current.style.transform = 'scale(1)';
    }
  };

  const handleMouseLeave = () => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '0';
      cursorRef.current.style.transform = 'scale(0)';
    }
  };

  const handleMouseMove = (e) => {
    if (!footerRef.current || !cursorRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const cursorWidth = cursorRef.current.offsetWidth;
    const cursorHeight = cursorRef.current.offsetHeight;
    
    const x = e.clientX - rect.left - (cursorWidth / 2);
    const y = e.clientY - rect.top - (cursorHeight / 2);

    cursorRef.current.style.left = `${x}px`;
    cursorRef.current.style.top = `${y}px`;
  };

  return (
    <footer 
      className="contact-footer" 
      ref={footerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="footer-content-wrapper">
        <h2 className="footer-title">Let's Build Cool Stuff!</h2>
        <Link to="/contact" className="footer-cta-button">Get in Touch</Link>

        <div className="footer-links">
          <a href="mailto:saisamaysilla@gmail.com" className="footer-link">Email</a>
          <span className="link-separator" aria-hidden="true">|</span>
          <a href="https://www.linkedin.com/in/saisamay/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <span className="link-separator" aria-hidden="true">|</span>
          <a href="https://github.com/saisamay" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>&copy; 2026 Sai Samay</p>
      </div>
      <div 
        className="cursor-effects" 
        ref={cursorRef}
        style={{
          opacity: 0, 
          transform: 'scale(0)', 
        }}
      ></div>
    </footer>
  );
};

export default Footer;
