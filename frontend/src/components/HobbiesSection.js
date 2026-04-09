import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function HobbiesSection() {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHobbies();
  }, []);

  const fetchHobbies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/content/hobbies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHobbies(response.data);
    } catch (error) {
      console.error('Error fetching hobbies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="hobbies" className="section">
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="hobbies" className="section" data-testid="hobbies-section">
      <h2 className="section-title" data-testid="hobbies-title">Hobbies & Interests</h2>
      
      <div className="max-w-6xl mx-auto">
        {hobbies.length === 0 ? (
          <div className="card text-center" data-testid="no-hobbies">
            <p className="text-gray-400">No hobbies yet. Admin can add hobbies.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hobbies.map((hobby, index) => (
              <div key={hobby.id} className="card text-center" data-testid={`hobby-${index}`}>
                {hobby.image && (
                  <img
                    src={hobby.image}
                    alt={hobby.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-spidey-red mb-2">{hobby.title}</h3>
                <p className="text-gray-300">{hobby.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
