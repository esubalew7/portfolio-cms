import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../context/ProjectContext';

export const ProjectsSection = () => {
  const { projects, loading, error } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'MERN', value: 'mern' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' }
  ];

  // STRICT FILTER LOGIC
  const filteredProjects = Array.isArray(projects) ? projects.filter((project) => {
    if (activeFilter === "all") return true;

    const projectCategory = (project.category || "")
      .toLowerCase()
      .trim();

    return projectCategory === activeFilter;
  }) : [];

  // DEBUG LOGS
  console.log("HOME SECTION FILTER:", activeFilter);
  console.log("HOME SECTION PROJECTS:", projects.map(p => p.category));

  return (
    <section id="projects" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 max-w-7xl relative">
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
        <motion.div variants={fadeIn('up', 0.2)} className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-6 py-2.5 rounded-full font-bold tracking-wide transition-all duration-300 transform active:scale-95 ${activeFilter === f.value
                ? 'bg-blue-600 text-white shadow-[0_5px_15px_-3px_rgba(37,99,235,0.4)]'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-700'
                }`}
            >
              {f.label}
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
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold text-lg">{error}</p>
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
            <AnimatePresence mode="popLayout">
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
