import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function AboutSection() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/content/about`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="section">
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section" data-testid="about-section">
      <h2 className="section-title" data-testid="about-title">About Me</h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h3 className="text-3xl font-bold text-spidey-red mb-4">{content?.title || 'About Me'}</h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {content?.description || 'Loading content...'}
          </p>
          
          {content?.skills && content.skills.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-spidey-blue mb-3">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-3">
                {content.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-spidey-red/20 border border-spidey-red rounded-full text-sm font-semibold"
                    data-testid={`skill-${index}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
