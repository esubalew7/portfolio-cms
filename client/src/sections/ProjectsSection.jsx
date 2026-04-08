import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import rentHousingPlatform from '../assets/Rent-housing-platform.png';
import collegeWebsite from '../assets/collegeWebsite.png';
import movieApp from '../assets/movieApp.png';
import portfolio from '../assets/portfolio.png';


const projectData = [
  {
    id: 1,
    title: 'Rent Housing Platform',
    category: 'MERN',
    image: rentHousingPlatform,
    description: 'A full-stack MERN application that connects tenants with landlords, featuring secure authentication, property listings, and advanced search and filtering for seamless rental experiences.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: 'https://rent-housing-finder-2.vercel.app/',
    githubUrl: 'https://github.com/esubalew7/Rent-Housing-Finder-2',
  },
  {
    id: 2,
    title: 'Portfolio Website',
    category: 'MERN',
    image: portfolio,
    description: 'A personal MERN portfolio showcasing my projects and skills with a modern, responsive design and smooth user experience.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    liveUrl: 'https://portfolio-mern-one-rho.vercel.app/',
    githubUrl: 'https://github.com/esubalew7/portfolio-mern',
  },
  {
    id: 3,
    title: 'College Website',
    category: 'Frontend',
    image: collegeWebsite,
    description: 'A responsive college website built with HTML, CSS, and JavaScript, featuring clean navigation and structured pages for academic information and campus content.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://college-website-lemon-three.vercel.app/',
    githubUrl: 'https://github.com/esubalew7/College-Website',
  },
  {
    id: 4,
    title: 'Movie Trailers Website',
    category: 'Frontend',
    image: movieApp,
    description: 'A React-based movie browsing app integrated with TMDB API, allowing users to explore trending films and watch trailers in a dynamic interface.',
    techStack: ['React'],
    liveUrl: 'https://movie-app-taupe-one.vercel.app/',
    githubUrl: 'https://github.com/esubalew7/movie-app',
  },
];

// Extracted card component for isolated state management (skeletons and hover scopes)
const ProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.2)] dark:hover:shadow-[0_20px_40px_-20px_rgba(59,130,246,0.3)] border border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col group transform hover:-translate-y-2 relative"
    >
      {/* Decorative gradient glow behind the card on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      <div className="relative overflow-hidden aspect-video z-10 bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 mix-blend-multiply" />

        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse z-10" />
        )}

        <img
          src={project.image}
          alt={project.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform sm:-translate-x-1 group-hover:scale-105 transition-all duration-700 ease-out z-10 ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
        />
      </div>
      <div className="p-8 flex flex-col flex-grow z-10 bg-gradient-to-b from-white/0 to-white/50 dark:to-gray-900/50">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.map(tech => (
            <span key={tech} className="px-3 py-1 bg-blue-50/80 dark:bg-gray-800/80 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider uppercase rounded-md border border-blue-100/50 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mt-auto">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-500/50"
          >
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export const ProjectsSection = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'MERN', 'Frontend', 'Backend'];

  const filteredProjects = projectData.filter((project) => {
    if (filter === 'All') return true;
    return project.category === filter;
  });

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
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-full font-bold tracking-wide transition-all duration-300 transform active:scale-95 ${filter === f
                ? 'bg-blue-600 text-white shadow-[0_5px_15px_-3px_rgba(37,99,235,0.4)]'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-700'
                }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};
