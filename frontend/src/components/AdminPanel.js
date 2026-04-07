import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function AdminPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // About state
  const [about, setAbout] = useState({ title: '', description: '', image: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', images: [], videos: [], github_link: '', deployed_link: '', technologies: []
  });
  const [editingProject, setEditingProject] = useState(null);

  // Education state
  const [education, setEducation] = useState([]);
  const [educationForm, setEducationForm] = useState({
    institution: '', degree: '', period: '', description: ''
  });
  const [editingEducation, setEditingEducation] = useState(null);

  // Achievements state
  const [achievements, setAchievements] = useState([]);
  const [achievementForm, setAchievementForm] = useState({
    title: '', description: '', date: '', image: ''
  });
  const [editingAchievement, setEditingAchievement] = useState(null);

  // Hobbies state
  const [hobbies, setHobbies] = useState([]);
  const [hobbyForm, setHobbyForm] = useState({ title: '', description: '', image: '' });
  const [editingHobby, setEditingHobby] = useState(null);

  useEffect(() => {
    fetchAllContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('session_token')}` }
  });

  const fetchAllContent = async () => {
    try {
      const [aboutRes, projectsRes, educationRes, achievementsRes, hobbiesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/content/about`, getAuthHeaders()),
        axios.get(`${BACKEND_URL}/api/content/projects`, getAuthHeaders()),
        axios.get(`${BACKEND_URL}/api/content/education`, getAuthHeaders()),
        axios.get(`${BACKEND_URL}/api/content/achievements`, getAuthHeaders()),
        axios.get(`${BACKEND_URL}/api/content/hobbies`, getAuthHeaders())
      ]);

      setAbout(aboutRes.data);
      setProjects(projectsRes.data);
      setEducation(educationRes.data);
      setAchievements(achievementsRes.data);
      setHobbies(hobbiesRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // About handlers
  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BACKEND_URL}/api/content/about`, about, getAuthHeaders());
      showMessage('About section updated successfully!');
    } catch (error) {
      showMessage('Error updating about section');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setAbout({ ...about, skills: [...about.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setAbout({ ...about, skills: about.skills.filter((_, i) => i !== index) });
  };

  // Project handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProject) {
        await axios.put(`${BACKEND_URL}/api/content/projects/${editingProject}`, projectForm, getAuthHeaders());
        showMessage('Project updated successfully!');
      } else {
        await axios.post(`${BACKEND_URL}/api/content/projects`, projectForm, getAuthHeaders());
        showMessage('Project added successfully!');
      }
      setProjectForm({ title: '', description: '', images: [], videos: [], github_link: '', deployed_link: '', technologies: [] });
      setEditingProject(null);
      fetchAllContent();
    } catch (error) {
      showMessage('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/content/projects/${id}`, getAuthHeaders());
        showMessage('Project deleted!');
        fetchAllContent();
      } catch (error) {
        showMessage('Error deleting project');
      }
    }
  };

  const editProject = (project) => {
    setProjectForm(project);
    setEditingProject(project.id);
  };

  // Education handlers
  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEducation) {
        await axios.put(`${BACKEND_URL}/api/content/education/${editingEducation}`, educationForm, getAuthHeaders());
        showMessage('Education updated!');
      } else {
        await axios.post(`${BACKEND_URL}/api/content/education`, educationForm, getAuthHeaders());
        showMessage('Education added!');
      }
      setEducationForm({ institution: '', degree: '', period: '', description: '' });
      setEditingEducation(null);
      fetchAllContent();
    } catch (error) {
      showMessage('Error saving education');
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (id) => {
    if (window.confirm('Delete this education entry?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/content/education/${id}`, getAuthHeaders());
        showMessage('Education deleted!');
        fetchAllContent();
      } catch (error) {
        showMessage('Error deleting education');
      }
    }
  };

  // Achievement handlers
  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAchievement) {
        await axios.put(`${BACKEND_URL}/api/content/achievements/${editingAchievement}`, achievementForm, getAuthHeaders());
        showMessage('Achievement updated!');
      } else {
        await axios.post(`${BACKEND_URL}/api/content/achievements`, achievementForm, getAuthHeaders());
        showMessage('Achievement added!');
      }
      setAchievementForm({ title: '', description: '', date: '', image: '' });
      setEditingAchievement(null);
      fetchAllContent();
    } catch (error) {
      showMessage('Error saving achievement');
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (id) => {
    if (window.confirm('Delete this achievement?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/content/achievements/${id}`, getAuthHeaders());
        showMessage('Achievement deleted!');
        fetchAllContent();
      } catch (error) {
        showMessage('Error deleting achievement');
      }
    }
  };

  // Hobby handlers
  const handleHobbySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingHobby) {
        await axios.put(`${BACKEND_URL}/api/content/hobbies/${editingHobby}`, hobbyForm, getAuthHeaders());
        showMessage('Hobby updated!');
      } else {
        await axios.post(`${BACKEND_URL}/api/content/hobbies`, hobbyForm, getAuthHeaders());
        showMessage('Hobby added!');
      }
      setHobbyForm({ title: '', description: '', image: '' });
      setEditingHobby(null);
      fetchAllContent();
    } catch (error) {
      showMessage('Error saving hobby');
    } finally {
      setLoading(false);
    }
  };

  const deleteHobby = async (id) => {
    if (window.confirm('Delete this hobby?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/content/hobbies/${id}`, getAuthHeaders());
        showMessage('Hobby deleted!');
        fetchAllContent();
      } catch (error) {
        showMessage('Error deleting hobby');
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4" data-testid="admin-panel">
      <div className="max-w-6xl mx-auto">
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-3xl font-bold text-spiderRed">⚙️ Admin Panel</h2>
             <button onClick={onClose} className="text-gray-400 hover:text-white">Close X</button>
          </div>
          <p className="text-gray-400">Manage your portfolio content</p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-600/20 border border-green-600 rounded-lg text-green-400" data-testid="admin-message">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['about', 'projects', 'education', 'achievements', 'hobbies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-spiderRed text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="card">
            <h3 className="text-2xl font-bold text-spiderBlue mb-4">Edit About Section</h3>
            <form onSubmit={handleUpdateAbout} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={about.title || ''}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  className="input-field"
                  required
                  data-testid="about-title-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={about.description || ''}
                  onChange={(e) => setAbout({ ...about, description: e.target.value })}
                  className="textarea-field"
                  required
                  data-testid="about-description-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={about.image || ''}
                  onChange={(e) => setAbout({ ...about, image: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="input-field"
                    placeholder="Add a skill"
                    data-testid="skill-input"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-secondary"
                    data-testid="add-skill-button"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-spiderRed/20 border border-spiderRed rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" data-testid="save-about-button">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-2xl font-bold text-spiderBlue mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="input-field"
                  required
                  data-testid="project-title-input"
                />
                <textarea
                  placeholder="Project Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="textarea-field"
                  required
                  data-testid="project-description-input"
                />
                <input
                  type="text"
                  placeholder="Image URLs (comma-separated)"
                  value={projectForm.images.join(', ')}
                  onChange={(e) => setProjectForm({ ...projectForm, images: e.target.value.split(',').map(s => s.trim()) })}
                  className="input-field"
                />
                <input
                  type="url"
                  placeholder="GitHub Link"
                  value={projectForm.github_link}
                  onChange={(e) => setProjectForm({ ...projectForm, github_link: e.target.value })}
                  className="input-field"
                  data-testid="project-github-input"
                />
                <input
                  type="url"
                  placeholder="Deployed Link"
                  value={projectForm.deployed_link}
                  onChange={(e) => setProjectForm({ ...projectForm, deployed_link: e.target.value })}
                  className="input-field"
                  data-testid="project-deployed-input"
                />
                <input
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={projectForm.technologies.join(', ')}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value.split(',').map(s => s.trim()) })}
                  className="input-field"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn-primary" data-testid="save-project-button">
                    {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({ title: '', description: '', images: [], videos: [], github_link: '', deployed_link: '', technologies: [] });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {projects.map((project, index) => (
              <div key={project.id} className="card" data-testid={`admin-project-${index}`}>
                <h4 className="text-xl font-bold text-spiderRed mb-2">{project.title}</h4>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => editProject(project)} className="btn-secondary text-sm">Edit</button>
                  <button onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-2xl font-bold text-spiderBlue mb-4">
                {editingEducation ? 'Edit Education' : 'Add Education'}
              </h3>
              <form onSubmit={handleEducationSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Institution"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Period (e.g., 2018-2022)"
                  value={educationForm.period}
                  onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                  className="input-field"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                  className="textarea-field"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : editingEducation ? 'Update' : 'Add'}
                  </button>
                  {editingEducation && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEducation(null);
                        setEducationForm({ institution: '', degree: '', period: '', description: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {education.map((edu, index) => (
              <div key={edu.id} className="card">
                <h4 className="text-xl font-bold text-spiderRed">{edu.degree}</h4>
                <p className="text-gray-400">{edu.institution} | {edu.period}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setEducationForm(edu); setEditingEducation(edu.id); }} className="btn-secondary text-sm">Edit</button>
                  <button onClick={() => deleteEducation(edu.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-2xl font-bold text-spiderBlue mb-4">
                {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
              </h3>
              <form onSubmit={handleAchievementSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  className="input-field"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={achievementForm.description}
                  onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                  className="textarea-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={achievementForm.date}
                  onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={achievementForm.image}
                  onChange={(e) => setAchievementForm({ ...achievementForm, image: e.target.value })}
                  className="input-field"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : editingAchievement ? 'Update' : 'Add'}
                  </button>
                  {editingAchievement && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAchievement(null);
                        setAchievementForm({ title: '', description: '', date: '', image: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {achievements.map((ach, index) => (
              <div key={ach.id} className="card">
                <h4 className="text-xl font-bold text-spiderRed">{ach.title}</h4>
                <p className="text-gray-400">{ach.date}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setAchievementForm(ach); setEditingAchievement(ach.id); }} className="btn-secondary text-sm">Edit</button>
                  <button onClick={() => deleteAchievement(ach.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hobbies Tab */}
        {activeTab === 'hobbies' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-2xl font-bold text-spiderBlue mb-4">
                {editingHobby ? 'Edit Hobby' : 'Add Hobby'}
              </h3>
              <form onSubmit={handleHobbySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Hobby Title"
                  value={hobbyForm.title}
                  onChange={(e) => setHobbyForm({ ...hobbyForm, title: e.target.value })}
                  className="input-field"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={hobbyForm.description}
                  onChange={(e) => setHobbyForm({ ...hobbyForm, description: e.target.value })}
                  className="textarea-field"
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={hobbyForm.image}
                  onChange={(e) => setHobbyForm({ ...hobbyForm, image: e.target.value })}
                  className="input-field"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : editingHobby ? 'Update' : 'Add'}
                  </button>
                  {editingHobby && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHobby(null);
                        setHobbyForm({ title: '', description: '', image: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {hobbies.map((hobby, index) => (
              <div key={hobby.id} className="card">
                <h4 className="text-xl font-bold text-spiderRed">{hobby.title}</h4>
                <p className="text-gray-400">{hobby.description}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setHobbyForm(hobby); setEditingHobby(hobby.id); }} className="btn-secondary text-sm">Edit</button>
                  <button onClick={() => deleteHobby(hobby.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}