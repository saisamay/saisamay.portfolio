import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function EducationSection() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${BACKEND_URL}/api/content/education`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEducation(response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="education" className="section">
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="section" data-testid="education-section">
      <h2 className="section-title" data-testid="education-title">Education</h2>
      
      <div className="max-w-4xl mx-auto">
        {education.length === 0 ? (
          <div className="card text-center" data-testid="no-education">
            <p className="text-gray-400">No education entries yet. Admin can add education.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className="card" data-testid={`education-${index}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-spidey-red">{edu.degree}</h3>
                  <span className="text-sm text-spidey-blue font-semibold">{edu.period}</span>
                </div>
                <h4 className="text-lg text-gray-300 mb-3">{edu.institution}</h4>
                <p className="text-gray-400">{edu.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
