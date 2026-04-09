import React, { useState, useEffect } from 'react';
import './index.css';
import SpiderWebBackground from './components/SpiderWebBackground';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import AchievementsSection from './components/AchievementsSection';
import HobbiesSection from './components/HobbiesSection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/check-session`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
        setIsAdmin(response.data.is_admin);
        setUserEmail(response.data.email);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  };

  const handleAuthSuccess = (token, admin, email) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setIsAdmin(admin);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserEmail('');
    setShowAdminPanel(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-spiderDark relative overflow-hidden">
        <SpiderWebBackground />
        <AuthModal onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spiderDark relative">
      <SpiderWebBackground />
      
      <Navbar 
        isAdmin={isAdmin} 
        userEmail={userEmail}
        onLogout={handleLogout}
        onToggleAdmin={() => setShowAdminPanel(!showAdminPanel)}
        showAdminPanel={showAdminPanel}
      />

      {showAdminPanel && isAdmin ? (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      ) : (
        <>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <EducationSection />
          <AchievementsSection />
          <HobbiesSection />
          <ContactSection />
        </>
      )}

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm py-6 text-center border-t border-spiderRed/30 relative z-10">
        <p className="text-gray-400">
          Made with <span className="text-spiderRed">❤️</span> and <span className="text-spiderBlue">🕷️</span>
        </p>
      </footer>
    </div>
  );
}

export default App;