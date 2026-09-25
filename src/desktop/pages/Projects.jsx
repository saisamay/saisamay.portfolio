import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ThreeDViewer from '../components/ThreeDViewer';

const Projects = () => {
  const [activeModel, setActiveModel] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.open = true;
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <header className="page-header container">
        <h1>My Projects</h1>
        <p className="subtitle">Dabbling in anything and everything I find interesting. Explore my vision!</p>
      </header>

      <details id="engineering-page">
        <summary className="section-title project-section">Engineering</summary>
        <div className="project-section-content">
          <div className="container">
            <ul className="project-list">
              <li className="project-card">
                <div className="project-image">
                  <img src="/Assets/Engineering Poster.png" alt="Automated Pill Dispenser Project" />
                </div>
                <div className="project-info">
                  <h3>Automated Pill Dispenser</h3>
                  <p>Economic and modular pill dispenser designed for reliable timing and dosage using an automated dispensing and easily refillable medicine storage chamber.</p>
                  <a href="https://github.com/PotatoSlop/Automated-Pill-Dispenser" className="project-link" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
              </li>
              <li className="project-card">
                <div className="project-image">
                  <img src="/Assets/Nob_Thumbnail.jpg" alt="Nob Smart Dial" />
                </div>
                <div className="project-info">
                  <h3>Nob [WIP]</h3>
                  <p>Nob is a wireless smart dial connected via Wi-Fi and Bluetooth. Designed for desktop volume control and macros.</p>
                  <a href="https://github.com/PotatoSlop/Nob" className="project-link" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </details>

      <details id="design-page">
        <summary className="section-title project-section">Design</summary>
        <div className="project-section-content">
          <div className="container">
            <ul className="project-list">
              <li className="project-card">
                <div className="project-image">
                  <img src="/Assets/Boat.png" alt="Low Poly Boat Asset" />
                </div>
                <div className="project-info">
                  <h3>Low-Poly Boat Asset</h3>
                  <p>Low-poly steam boat model designed and published as a free 3D Unity Asset for users to download and use in their projects.</p>
                  <button className="project-link view-3d-button" onClick={() => setActiveModel('/Assets/models/boat.glb')}>View Model</button>
                </div>
              </li>
              <li className="project-card">
                <div className="project-image">
                  <img src="/Assets/Peacemaker.jpg" alt="Original Design Combative Robot 3D Model" />
                </div>
                <div className="project-info">
                  <h3>Peacemaker</h3>
                  <p>Rigged Hard surface 3D model of Peacemaker, an original mecha design illustrated by me in 2D using Procreate. Brought to life in Blender.</p>
                  <button className="project-link view-3d-button" onClick={() => setActiveModel('/Assets/models/WIPMecha.glb')}>View Model</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </details>

      <details id="photography-page">
        <summary className="section-title project-section">Photography</summary>
        <div className="project-section-content">
          <div className="container">
            <div className="gallery-section">
              <div id="landscape-gallery" className="gallery-grid landscape-grid">
                {/* Populate dynamically if needed, keeping empty as in original */}
              </div>
            </div>
            <div className="gallery-section">
              <div id="portrait-gallery" className="gallery-grid portrait-grid">
              </div>
            </div>
            <div className="gallery-section">
              <div id="portrait-short-gallery" className="gallery-grid portrait-short-grid">
              </div>
            </div>
          </div>
        </div>
      </details>

      <details id="programming-page">
        <summary className="section-title project-section">Programming</summary>
        <div className="project-section-content">
          <div className="container">
            <ul className="project-list">
              <li className="project-card">
                <div className="project-image">
                  <img src="/Assets/WebsiteLandingPageScreenshot.svg" alt="Portfolio Project" />
                </div>
                <div className="project-info">
                  <h3>Portfolioslop</h3>
                  <p>Personal portfolio website that showcases my various projects and interests (You're viewing this project right now!)</p>
                  <a href="https://github.com/PotatoSlop/Portfolioslop" className="project-link" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
              </li>
              <li className="project-card">
                <div className="project-image">
                  <img src="/Assets/ColorMatch.svg" alt="Color Match Project" />
                </div>
                <div className="project-info">
                  <h3>Color Match [WIP]</h3>
                  <p>Color-Match is a free to play (FTP) indie card card battling game developed in Godot about matching colors. Battle in 1v1 puzzles where you can mix and match your way into victory with color theory!</p>
                  <a href="https://github.com/PotatoSlop/color-match" className="project-link" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </details>

      {activeModel && <ThreeDViewer modelUrl={activeModel} onClose={() => setActiveModel(null)} />}
    </>
  );
};

export default Projects;
