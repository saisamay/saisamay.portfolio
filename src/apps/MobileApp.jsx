import { Routes, Route } from 'react-router-dom';
import Navbar from '../mobile/components/Navbar';
import Footer from '../mobile/components/Footer';
import Home from '../mobile/pages/Home';
import Projects from '../mobile/pages/Projects';
import About from '../mobile/pages/About';
import Contact from '../mobile/pages/Contact';

const MobileApp = () => {
  return (
    <div className="mobile-app-container">
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

export default MobileApp;
