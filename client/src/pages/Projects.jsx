import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../context/ProjectContext';

export const Projects = () => {
  const { projects, loading, error } = useProjects();
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'MERN', 'Frontend', 'Backend'];

  const getFilteredProjects = () => {
    if (!projects) return [];

    const activeFilter = filter.toLowerCase();

    return projects.filter((project) => {
      if (activeFilter === "all") return true;

      const category = project.category?.toLowerCase().trim();
      return category === activeFilter;
    });
  };

  const filteredProjects = getFilteredProjects();

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <motion.div
        variants={staggerContainer(0.2, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-8"></div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div variants={fadeIn('up', 0.2)} className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${filter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20 space-y-4">
            <div className="text-yellow-600 dark:text-yellow-400">
              <div className="text-xl font-semibold mb-2">⚠️ Projects Temporarily Unavailable</div>
              <p className="text-lg">{error}</p>
              <p className="text-sm opacity-75 mt-2">Backend services are waking up (Render free tier sleeps after inactivity).</p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('retryProjects'))}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Retry Now
            </button>
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No projects match the selected filter.</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
