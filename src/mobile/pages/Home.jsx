import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const initialText = "Hi! I'm";
const typingSpeed = 100;
const wordDelay = 150;
const vowelRegex = /^[aeiouAEIOU]$/;

const Home = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropZoneItem, setDropZoneItem] = useState(null); // id of dropped item
  const [draggedItem, setDraggedItem] = useState(null);
  
  const titleRef = useRef(null);
  const gifRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    let isMounted = true;
    const typeText = async () => {
      let currentText = '';
      for (const char of initialText) {
        if (!isMounted) break;
        currentText += char;
        setTypedText(currentText);
        let delay = typingSpeed;
        if (char === ' ') delay += wordDelay;
        await new Promise(res => setTimeout(res, delay));
      }
      if (isMounted) {
        setTimeout(() => {
          setAnimationsComplete(true);
        }, 250);
      }
    };
    
    // Initial delay before typing
    const timeoutId = setTimeout(() => {
      typeText();
    }, 250);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!animationsComplete) return;
      const scrollY = window.scrollY;
      
      if (scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
        // If returning to top, put dropped item back
        if (dropZoneItem) {
          setDropZoneItem(null);
        }
      }
      
      // Title fade
      if (titleRef.current) {
        let opacity = 1 - Math.min(scrollY / 200, 1);
        titleRef.current.style.opacity = opacity;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationsComplete, dropZoneItem]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedItem(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setDropZoneItem(id);
    
    // Redirect based on category
    const redirects = {
      "Engineer": "/projects#engineering-page",
      "Designer": "/projects#design-page",
      "Photographer": "/projects#photography-page",
      "Programmer": "/projects#programming-page"
    };
    
    if (redirects[id]) {
      setTimeout(() => {
        navigate(redirects[id]);
      }, 500);
    }
  };

  // Determine article
  const getDisplayText = () => {
    if (!scrolled) return typedText;
    if (dropZoneItem || draggedItem) {
      const item = dropZoneItem || draggedItem;
      const article = vowelRegex.test(item.charAt(0)) ? " an" : " a";
      return initialText + article;
    }
    return initialText + " a";
  };

  const categories = ["Engineer", "Designer", "Photographer", "Programmer"];

  return (
    <main>
      <section className="landing">
        <div className="job-role-container">
          <h2 className={`typewriter-animation ${scrolled ? 'scrolled shift-left' : ''}`}>
            {getDisplayText()}
          </h2>
          <div 
            id="category-drop-zone" 
            className={scrolled ? 'scrolled' : ''}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!dropZoneItem && <span className="placeholder-text">{draggedItem || "[Drop Here]"}</span>}
            {dropZoneItem && (
              <span id={dropZoneItem} className="draggable-item" draggable="true">
                <span className="bracket" aria-hidden="true">[</span>{dropZoneItem}<span className="bracket" aria-hidden="true">]</span>
              </span>
            )}
          </div>
        </div>

        <h1 
          id="scroll-title" 
          ref={titleRef}
          style={{
            transform: animationsComplete ? 'translateY(0)' : 'translateY(200px)',
            opacity: animationsComplete ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(.2,1.2,.6,1), opacity 0.5s'
          }}
        >
          Samay
        </h1>
      </section>

      <aside 
        className="bottom-gif" 
        aria-hidden="true"
        ref={gifRef}
        style={{
          transform: animationsComplete ? 'translateY(0)' : 'translateY(100px)',
          opacity: animationsComplete ? 1 : 0,
          transition: 'transform 1.2s cubic-bezier(.4,1.25,.6,1), opacity 0.5s'
        }}
      >
        <img height="844" width="630" src="/Assets/wavingDude.gif" alt="Waving Dude" />
      </aside>

      <div 
        className="scroll-down-text wave-text"
        style={{
          opacity: (animationsComplete && !scrolled) ? 1 : 0,
          transition: 'opacity 0.7s'
        }}
      >
        <span className="arrow-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle'}}>
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>S</span><span>c</span><span>r</span><span>o</span><span>l</span><span>l</span>
        <span style={{marginLeft: '0.5ch'}}></span>
        <span>D</span><span>o</span><span>w</span><span>n</span>
      </div>

      <div 
        className={`categorySelect ${scrolled ? 'scrolled' : ''}`} 
        role="group" 
        aria-label="Drag and drop job roles" 
        id="role-instructions"
        onDragOver={handleDragOver}
        onDrop={(e) => {
          e.preventDefault();
          setDropZoneItem(null);
        }}
      >
        {categories.map(cat => (
          cat !== dropZoneItem && (
            <span 
              key={cat}
              id={cat} 
              className="draggable-item" 
              draggable="true"
              onDragStart={(e) => handleDragStart(e, cat)}
              onDragEnd={() => setDraggedItem(null)}
              style={{ opacity: draggedItem === cat ? 0.5 : 1 }}
            >
              <span className="bracket" aria-hidden="true">[</span>{cat}<span className="bracket" aria-hidden="true">]</span>
            </span>
          )
        ))}
      </div>

      <section className="temp-section"></section>
    </main>
  );
};

export default Home;
