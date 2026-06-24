import { motion } from 'framer-motion';
import { Edit, Trash2, ExternalLink, Github, Layers } from 'lucide-react';
import Button from '../ui/Button';

const DashboardProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group font-sans"
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Layers size={40} className="opacity-20" />
            <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Preview</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Quick Actions (Floating) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
             <Button variant="secondary" icon={Edit} onClick={() => onEdit(project)} className="p-2.5 rounded-xl shadow-xl border-none" />
             <Button variant="danger" icon={Trash2} onClick={() => onDelete(project)} className="p-2.5 rounded-xl shadow-xl border-none" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {(project.technologies || []).slice(0, 4).map((tech, i) => (
            <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
              {tech}
            </span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="text-[10px] text-gray-400 ml-1">+{project.technologies.length-4}</span>
          )}
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-4">
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                <ExternalLink size={18} />
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github size={18} />
              </a>
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap overflow-hidden">
            Managed Project
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardProjectCard;
