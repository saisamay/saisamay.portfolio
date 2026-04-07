import React from 'react';

export default function HeroSection() {
  return (
    <section className="section flex items-center justify-center" data-testid="hero-section">
      <div className="text-center max-w-4xl">
        <h1 className="text-7xl font-bold mb-6 glitch-text" data-testid="hero-title">
          Welcome to the Web
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          A <span className="text-spidey-red font-bold">Spider-Powered</span> 3D Portfolio Experience
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#about" className="btn-primary" data-testid="explore-button">
            Explore Portfolio
          </a>
          <a href="#contact" className="btn-secondary" data-testid="contact-button">
            Get in Touch
          </a>
        </div>
        
        {/* Animated Spider */}
        <div className="mt-12 text-6xl animate-web-swing" data-testid="spider-icon">
          🕷️
        </div>
      </div>
    </section>
  );
}
