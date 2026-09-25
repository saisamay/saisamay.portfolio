import { useEffect, useState, useRef } from 'react';

const About = () => {
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const animationDistance = containerRef.current.offsetHeight - windowHeight;
      
      if (animationDistance <= 0) return;
      
      const scrolledIntoContainer = -rect.top;
      const progress = scrolledIntoContainer / animationDistance;
      const clampProgress = Math.min(Math.max(progress, 0), 1);
      
      if (clampProgress >= 0.3) {
        setFlipped(true);
      } else {
        setFlipped(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="container about-page-main" ref={containerRef}>
      <div className="scroll-animation-container">
        <div className="sticky-wrapper">
          <div className="about-image-stack">
            <div className={`headshot ${flipped ? 'flipped' : ''}`}>
              <img className="headshot-face doodle-image" src="/Assets/wavingDude.gif" alt="Doodle of Samay" />
              <img className="headshot-face real-photo" src="/Assets/samay.png" alt="Sai Samay Headshot" />
            </div>
          </div>

          <div className="about-text-stack">
            <div className={`text-block ${flipped ? 'is-visible' : ''}`} id="intro-text">
              <h1>About Me</h1>
              <p className="block-text">
                I'm a Computer Science undergraduate passionate about building scalable software and solving real-world engineering challenges. My interests span full-stack development, backend architecture, cloud-native applications, and AI-powered systems, where I enjoy transforming ideas into efficient, maintainable, and impactful solutions. I have experience developing RESTful APIs, designing backend services, integrating modern frontend technologies, and leveraging cloud platforms to build production-oriented applications. Alongside software engineering, I actively explore Artificial Intelligence and Machine Learning, particularly in areas where intelligent systems can automate workflows, enhance user experiences, and address practical problems through data-driven solutions.
                <br/><br/>
                Curiosity drives the way I learn and build. I enjoy exploring unfamiliar technologies, frameworks, and engineering concepts, constantly pushing myself beyond my comfort zone through challenging projects and hands-on experimentation. Whether it's understanding distributed systems, adopting new development tools, experimenting with emerging AI frameworks, or strengthening my foundations in system design and problem solving, I view every new technology as an opportunity to grow. I believe great software is built on continuous learning, thoughtful design, and a willingness to embrace complex challenges, and I strive to apply that mindset to every project I undertake.
              </p>
              <a href="/Assets/Samay.pdf" download="Samay Resume 2025" className="resume-btn">
                Download Resume
              </a>
            </div>

            <div className={`text-block ${!flipped ? 'is-visible' : ''}`} id="philosophy-text">
              <h1>It Starts with a Sketch</h1>
              <p className="block-text">
                Napkins, printer paper, sketchbooks or just my mind, my projects start from a simple idea that is brought to reality. If you need a creative developer, a technical designer, or anything in between, I can bring a new perspective to your vision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
