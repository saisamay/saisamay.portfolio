import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await axios.get(`${BACKEND_URL}/api/content/achievements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="achievements" className="section">
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="section" data-testid="achievements-section">
      <h2 className="section-title" data-testid="achievements-title">Achievements</h2>
      
      <div className="max-w-6xl mx-auto">
        {achievements.length === 0 ? (
          <div className="card text-center" data-testid="no-achievements">
            <p className="text-gray-400">No achievements yet. Admin can add achievements.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="card" data-testid={`achievement-${index}`}>
                {achievement.image && (
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-spidey-red">{achievement.title}</h3>
                  <span className="text-sm text-spidey-blue">{achievement.date}</span>
                </div>
                <p className="text-gray-300">{achievement.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
