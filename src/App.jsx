import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import DesktopApp from './apps/DesktopApp';
import MobileApp from './apps/MobileApp';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </Router>
  );
}

export default App;
