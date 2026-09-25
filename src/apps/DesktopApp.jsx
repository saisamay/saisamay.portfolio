import { Routes, Route } from 'react-router-dom';
import Navbar from '../desktop/components/Navbar';
import Footer from '../desktop/components/Footer';
import Home from '../desktop/pages/Home';
import Projects from '../desktop/pages/Projects';
import About from '../desktop/pages/About';
import Contact from '../desktop/pages/Contact';

const DesktopApp = () => {
  return (
    <div className="desktop-app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default DesktopApp;
