import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Loader2 as Loader,
  ExternalLink,
  Github,
} from 'lucide-react';

const DashboardProjects = () => {
  console.log('DashboardProjects component rendering');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    liveLink: '',
    githubLink: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered');
    fetchProjects();
  }, []);

  const isValidUrl = (value) => {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      setLoading(true);
      setError(null);

      console.log('Making API call...');
      const response = await api.get('/api/projects');

      console.log('API response:', response.data);
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch projects';
      setError(errorMessage);
      setSuccess(null);
      setProjects([]); // Ensure projects is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormErrors({});
      setError('Title and description are required');
      return;
    }

    if (formData.image.trim() && !isValidUrl(formData.image.trim())) {
      setFormErrors({ image: 'Please enter a valid image URL' });
      setError('Please fix the image URL before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setFormErrors({});

      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
      };

      if (editingProject) {
        // Update existing project in state
        const response = await api.put(`/api/projects/${editingProject._id}`, projectData);
        const updatedProject = response.data;

        setProjects((prevProjects) => prevProjects.map((project) =>
          (project._id || project.id) === (updatedProject._id || updatedProject.id)
            ? updatedProject
            : project
        ));
        setSuccess('Project updated successfully');
      } else {
        // Create new project and add to state immediately
        const response = await api.post('/api/projects', projectData);
        const newProject = response.data;

        setProjects((prevProjects) => [newProject, ...prevProjects]);
        setSuccess('Project created successfully');
      }

      closeModal();
    } catch (err) {
      console.error('Error saving project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save project';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await api.delete(`/api/projects/${projectId}`);

      setProjects((prevProjects) => prevProjects.filter((project) => (project._id || project.id) !== projectId));
      setSuccess('Project deleted successfully');

      window.setTimeout(() => {
        setSuccess(null);
      }, 4000);
    } catch (err) {
      console.error('Error deleting project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete project';
      setError(errorMessage);
    }
  };

  const openModal = (project = null) => {
    setError(null);
    setSuccess(null);
    setFormErrors({});

    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: project.technologies ? project.technologies.join(', ') : '',
        image: project.image || '',
        liveLink: project.liveLink || '',
        githubLink: project.githubLink || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        image: '',
        liveLink: '',
        githubLink: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image: '',
      liveLink: '',
      githubLink: ''
    });
    setFormErrors({});
    setError(null);
  };

  const normalizedText = (value, fallback = 'No data available') => {
    if (value === undefined || value === null || value === false) return fallback;
    if (typeof value === 'string' && !value.trim()) return fallback;
    return value;
  };

  const filteredProjects = projects.filter(project =>
    (project.title || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.technologies || []).some(tech => tech.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date available';
    const date = new Date(timestamp);
    if (Number.isNaN(date.valueOf())) return 'No date available';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Status Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-800 dark:text-green-200">{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading projects...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Technologies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No projects match your search.' : 'No projects found. Create your first project!'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id || project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {normalizedText(project.title, 'Untitled project')}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis">
                            {normalizedText(project.description, 'No description available')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded"
                              >
                                {normalizedText(tech, 'Unknown')}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No technologies available</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {project.liveLink || project.githubLink ? (
                          <div className="flex flex-wrap items-center gap-3">
                            {project.liveLink ? (
                              <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                title="Live Demo"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="text-xs">Live</span>
                              </a>
                            ) : null}
                            {project.githubLink ? (
                              <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                title="GitHub Repository"
                              >
                                <Github className="h-4 w-4" />
                                <span className="text-xs">GitHub</span>
                              </a>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No links available</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal(project)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id || project.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Technologies
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB (comma-separated)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setFormErrors((prev) => ({ ...prev, image: undefined }));
                    }}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${formErrors.image ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'}`}
                  />
                  {formErrors.image && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {formErrors.image}
                    </p>
                  )}
                  {formData.image.trim() && isValidUrl(formData.image.trim()) && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={formData.image.trim()}
                        alt="Project preview"
                        className="w-full h-52 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Live Link
                  </label>
                  <input
                    type="url"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                    placeholder="https://yourproject.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {submitting && <Loader className="h-4 w-4 animate-spin" />}
                    <span>{submitting ? 'Saving...' : (editingProject ? 'Update' : 'Create')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProjects;
