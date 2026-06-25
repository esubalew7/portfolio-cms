import { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback for missing elements
  const imageSrc = project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';
  const liveUrl = project.liveLink || project.liveUrl || '#';
  const githubUrl = project.githubLink || project.githubUrl || '#';

  // Clean technologies logic allowing string or array mapping
  const techStack = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === 'string' && project.technologies.trim().length > 0
      ? project.technologies.split(',').map(t => t.trim())
      : project.techStack || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.2)] dark:hover:shadow-[0_20px_40px_-20px_rgba(59,130,246,0.3)] border border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col group transform hover:-translate-y-2 relative"
    >
      {/* Decorative gradient glow behind the card on hover; different accent for mobile apps */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 ${String(project.category || '').toLowerCase().trim() === 'mobile' ? 'bg-gradient-to-r from-amber-400/0 via-amber-400/8 to-amber-400/0' : 'bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0'}`} />

      <div className="relative overflow-hidden aspect-video z-10 bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 mix-blend-multiply" />

        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse z-10" />
        )}

        <a 
          href={liveUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          data-cursor="explore"
          className="block w-full h-full cursor-pointer relative group/image overflow-hidden"
        >
          {/* Zooming Image */}
          <img
            src={imageSrc}
            alt={project.title || "Project Image"}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover/image:scale-110 ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
            <div className="flex items-center gap-3">
              {String(project.category || '').toLowerCase().trim() === 'mobile' && (
                <svg className="w-8 h-8 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="7" y="2" width="10" height="20" rx="2" ry="2" strokeWidth="1.5"/><circle cx="12" cy="18" r="0.5"/></svg>
              )}
              <span className="text-white font-bold text-lg translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                View Project 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </div>
        </a>
      </div>
      <div className="p-6 sm:p-8 flex flex-col flex-grow z-10 bg-gradient-to-b from-white/0 to-white/50 dark:to-gray-900/50">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest rounded-full backdrop-blur-sm border border-gray-300/30 dark:border-gray-700/30 ${String(project.category || '').toLowerCase().trim() === 'mobile' ? 'bg-amber-50/80 text-amber-700 dark:bg-amber-900/10 dark:text-amber-300' : 'bg-gray-200/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300'}`}>
            {String(project.category || "frontend").toLowerCase().trim() === 'mobile' ? 'Mobile App' : String(project.category || "frontend").toLowerCase().trim()}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 flex-grow leading-relaxed line-clamp-3 sm:line-clamp-4 hover:line-clamp-none transition-all duration-300">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {techStack.map((tech, index) => (
            <span key={`${tech}-${index}`} className={`px-3 py-1 ${String(project.category || '').toLowerCase().trim() === 'mobile' ? 'bg-amber-50/90 text-amber-700 dark:bg-amber-900/10 dark:text-amber-300 border-amber-100/60' : 'bg-blue-50/80 dark:bg-gray-800/80 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-gray-700/50'} text-xs font-bold tracking-wider uppercase rounded-md shadow-sm backdrop-blur-sm`}>
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mt-auto">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-500/50"
          >
            Live Demo
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="code"
            className="flex-1 text-center py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
