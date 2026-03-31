import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';

const projectData = [
  {
    id: 1,
    title: 'E-commerce Platform',
    category: 'MERN',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800&auto=format&fit=crop',
    description: 'A full-scale e-commerce solution with state management, secure payment integration, and a comprehensive admin dashboard.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    title: 'AI Dashboard UI',
    category: 'Frontend',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    description: 'A dark-themed modern dashboard interface designed with Tailwind CSS, data visualization, and Framer Motion.',
    techStack: ['React', 'Tailwind', 'Framer Motion'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Social Media API',
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    description: 'A robust REST API architecture providing real-time messaging, JWT authentication, and optimized aggregation pipelines.',
    techStack: ['Node.js', 'Express', 'JWT', 'Socket.io'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 4,
    title: 'Real-Estate Tracker',
    category: 'MERN',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    description: 'Property search application featuring dynamic maps integration, advanced filtering algorithms, and user authentication.',
    techStack: ['React', 'MongoDB', 'Node.js', 'Leaflet'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 5,
    title: 'Portfolio Design System',
    category: 'Frontend',
    image: 'https://images.unsplash.com/photo-1507238692062-5a042a98762d?q=80&w=800&auto=format&fit=crop',
    description: 'A comprehensive generic design system component library built purely with React and custom CSS modules.',
    techStack: ['React', 'CSS Modules', 'Storybook'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 6,
    title: 'Serverless Data Processing',
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    description: 'A scalable serverless architecture utilizing AWS Lambda and S3 for asynchronous image processing.',
    techStack: ['Node.js', 'AWS Lambda', 'S3'],
    liveUrl: '#',
    githubUrl: '#',
  }
];

export const Projects = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'MERN', 'Frontend', 'Backend'];

  const filteredProjects = projectData.filter((project) => {
    if (filter === 'All') return true;
    return project.category === filter;
  });

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
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col group"
              >
                {/* Image Container with Hover Effect */}
                <div className="relative overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-auto">
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm"
                    >
                      Live Demo
                    </a>
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold flex items-center justify-center gap-2 rounded-lg transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};
