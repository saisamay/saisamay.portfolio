import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialText = "Hi! I'm";
const typingSpeed = 100;
const wordDelay = 150;

const categories = [
  'Engineer',
  'Designer',
  'Photographer',
  'Programmer',
];

const redirects = {
  Engineer: '/projects#engineering-page',
  Designer: '/projects#design-page',
  Photographer: '/projects#photography-page',
  Programmer: '/projects#programming-page',
};

const vowelRegex = /^[aeiouAEIOU]$/;

const Home = () => {
  const navigate = useNavigate();

  const [typedText, setTypedText] = useState('');
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [samayVisible, setSamayVisible] = useState(false);
  const [gifVisible, setGifVisible] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [dropZoneItem, setDropZoneItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const titleRef = useRef(null);

  /* ==================== HERO INTRO SEQUENCE ==================== */

  useEffect(() => {
    let mounted = true;

    const typeText = async () => {
      let currentText = '';

      for (const char of initialText) {
        if (!mounted) return;

        currentText += char;
        setTypedText(currentText);

        const delay =
          char === ' '
            ? typingSpeed + wordDelay
            : typingSpeed;

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }

      if (!mounted) return;

      /*
       * Sequence:
       * 1. Hi! I'm finishes
       * 2. Samay appears
       * 3. Waving hand appears
       */
      setAnimationsComplete(true);

      const samayTimer = setTimeout(() => {
        if (mounted) {
          setSamayVisible(true);
        }
      }, 50);

      const gifTimer = setTimeout(() => {
        if (mounted) {
          setGifVisible(true);
        }
      }, 900);

      return () => {
        clearTimeout(samayTimer);
        clearTimeout(gifTimer);
      };
    };

    const startTimer = setTimeout(() => {
      typeText();
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(startTimer);
    };
  }, []);

  /* ==================== SCROLL ==================== */

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hasScrolled = scrollY > 300;

      setScrolled(hasScrolled);

      /*
       * Fade Samay while scrolling.
       */
      if (titleRef.current) {
        const opacity = 1 - Math.min(scrollY / 200, 1);
        titleRef.current.style.opacity = opacity;
      }

      /*
       * Reset selected role when returning to top.
       */
      if (!hasScrolled) {
        setDropZoneItem(null);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* ==================== DRAG & DROP ==================== */

  const handleDragStart = (event, role) => {
    event.dataTransfer.setData('text/plain', role);
    setDraggedItem(role);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const role = event.dataTransfer.getData('text/plain');

    if (!role || !redirects[role]) {
      return;
    }

    setDropZoneItem(role);
    setDraggedItem(null);

    setTimeout(() => {
      navigate(redirects[role]);
    }, 500);
  };

  /* ==================== GREETING ==================== */

  const getGreeting = () => {
    /*
     * Initial state:
     * Hi! I'm
     */
    if (!scrolled) {
      return typedText;
    }

    /*
     * Scrolled state:
     * Hi! I'm a
     */
    if (dropZoneItem || draggedItem) {
      const role = dropZoneItem || draggedItem;

      const article = vowelRegex.test(role.charAt(0))
        ? ' an'
        : ' a';

      return `${initialText}${article}`;
    }

    return `${initialText} a`;
  };

  return (
    <main>

      {/* ==================== LANDING ==================== */}

      <section className="landing">

        {/* ==================== HERO INTRO ==================== */}

        <div className="hero-intro-container">

          {/* Greeting + Drop Zone */}

          <div
            className={`job-role-container ${
              scrolled ? 'has-drop-zone' : ''
            }`}
          >

            <h2 className="typewriter-animation">
              {getGreeting()}
            </h2>

            {/* Drop Zone appears only after scrolling */}

            {scrolled && (
              <div
                id="category-drop-zone"
                className="scrolled"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >

                {!dropZoneItem && (
                  <span className="placeholder-text">
                    {draggedItem || '[Drop Here]'}
                  </span>
                )}

                {dropZoneItem && (
                  <span
                    id={dropZoneItem}
                    className="draggable-item"
                    draggable="true"
                    onDragStart={(event) =>
                      handleDragStart(event, dropZoneItem)
                    }
                    onDragEnd={() => setDraggedItem(null)}
                  >
                    <span
                      className="bracket"
                      aria-hidden="true"
                    >
                      [
                    </span>

                    {dropZoneItem}

                    <span
                      className="bracket"
                      aria-hidden="true"
                    >
                      ]
                    </span>
                  </span>
                )}

              </div>
            )}

          </div>

          {/* ==================== ROLE OPTIONS ==================== */}

          {scrolled && (
            <div
              className="categorySelect"
              role="group"
              aria-label="Drag and drop job roles"
              id="role-instructions"
              onDragOver={handleDragOver}
              onDrop={(event) => {
                event.preventDefault();
                setDropZoneItem(null);
              }}
            >
              {categories.map((role) => {
                if (role === dropZoneItem) {
                  return null;
                }

                return (
                  <span
                    key={role}
                    id={role}
                    className="draggable-item"
                    draggable="true"
                    onDragStart={(event) =>
                      handleDragStart(event, role)
                    }
                    onDragEnd={() => setDraggedItem(null)}
                    style={{
                      opacity:
                        draggedItem === role ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="bracket"
                      aria-hidden="true"
                    >
                      [
                    </span>

                    {role}

                    <span
                      className="bracket"
                      aria-hidden="true"
                    >
                      ]
                    </span>
                  </span>
                );
              })}
            </div>
          )}

        </div>

        {/* ==================== SAMAY ==================== */}

        <h1
          id="scroll-title"
          ref={titleRef}
          className={samayVisible ? 'hero-title-visible' : ''}
        >
          Samay
        </h1>

      </section>

      {/* ==================== WAVING GIF ==================== */}

      <aside
        className={`bottom-gif ${
          gifVisible ? 'hero-gif-visible' : ''
        }`}
        aria-hidden="true"
      >
        <img
          src="/Assets/wavingDude.gif"
          alt="Waving Dude"
          width="630"
          height="844"
        />
      </aside>

      {/* ==================== SCROLL INDICATOR ==================== */}

      <div
        className="scroll-down-text wave-text"
        style={{
          opacity:
            animationsComplete && !scrolled
              ? 1
              : 0,
          transition: 'opacity 0.7s',
        }}
      >
        <span
          className="arrow-icon"
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14m0 0l-6-6m6 6l6-6"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span>S</span>
        <span>c</span>
        <span>r</span>
        <span>o</span>
        <span>l</span>
        <span>l</span>

        <span className="scroll-space" />

        <span>D</span>
        <span>o</span>
        <span>w</span>
        <span>n</span>
      </div>

      <section className="temp-section"></section>

    </main>
  );
};

export default Home;