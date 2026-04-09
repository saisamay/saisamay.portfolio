import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/content/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="section">
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section" data-testid="projects-section">
      <h2 className="section-title" data-testid="projects-title">Projects</h2>
      
      <div className="max-w-6xl mx-auto">
        {projects.length === 0 ? (
          <div className="card text-center" data-testid="no-projects">
            <p className="text-gray-400">No projects yet. Admin can add projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.id} className="card" data-testid={`project-${index}`}>
                {project.images && project.images.length > 0 && (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <h3 className="text-xl font-bold text-spidey-red mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-spidey-blue/20 text-spidey-blue text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3">
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-spidey-blue hover:underline"
                      data-testid={`project-github-${index}`}
                    >
                      🐈 GitHub
                    </a>
                  )}
                  {project.deployed_link && (
                    <a
                      href={project.deployed_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-spidey-red hover:underline"
                      data-testid={`project-demo-${index}`}
                    >
                      🚀 Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
