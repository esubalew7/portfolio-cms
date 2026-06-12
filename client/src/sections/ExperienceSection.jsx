import { motion } from 'framer-motion';
import TimelineItem from '../components/ui/TimelineItem';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import testimonials from '../data/testimonials';
import { fadeIn } from '../animations/variants';

const ExperienceSection = () => {

  const education = [
    {
      role: 'Computer Science Student',
      company: 'Bahir Dar University',
      duration: '2024 — Present',
      location: 'Bahir Dar, Ethiopia',
      tags: ['Algorithms', 'Data Structures', 'Databases'],
      bullets: ['Relevant coursework: Web Dev, Mobile Dev, Databases, Algorithms, Software Engineering'],
      logo: 'images/bdu.jpg',
    },
  ];

  const internship = [
    {
      role: 'Full Stack Developer Intern',
      company: 'Askuala Link',
      duration: 'Jun 2026 — Aug 2026',
      location: 'Bahir Dar/ Ethiopia',
      tags: [],
      bullets: ['as a Software Engineer Intern working on multiple web applications'],
      logo: 'images/askuala.jpg',
    },
  ];

  const certifications = [
    {
      role: 'Front-End Development Certification',
      company: 'Certification Provider',
      duration: '2025',
      location: '',
      tags: ['React', 'JavaScript', 'CSS', 'HTML'],
      bullets: ['Web Development Certificate @ coddy.tech', 'Advanced Programming (React)  @ BiT Career Development Center', 'CCNA: Introduction to Networks @ Cisco Networking Academy'],
      logo: '',
    },
  ];

  /*const projects = [
    {
      role: 'Freelance / Personal Projects',
      company: 'Personal Portfolio & Client Work',
      duration: '2022 — Present',
      location: '',
      tags: ['MERN', 'Vite', 'Tailwind', 'Framer Motion'],
      bullets: [
        'Designed and shipped client portfolios with an emphasis on performance and accessibility.',
        'Implemented interactive UI patterns and animations for premium experience.',
      ],
      logo: '',
    },
  ]; */

  return (
    <section id="experience" className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">Experience</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">A professional timeline highlighting internships, education, certifications, and freelance work — concise and recruiter-friendly.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-10">

        <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Education</h3>
          <div className="space-y-6">
            {education.map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Internship Experience</h3>
          <div className="space-y-6">
            {internship.map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Certifications</h3>
          <div className="space-y-6">
            {certifications.map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </div>
        </div>

        <div>
          <motion.div
            variants={fadeIn('up', 0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Client Feedback
            </h3>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              What people say about working with me.
            </p>
          </motion.div>

          <TestimonialsMarquee testimonials={testimonials} />
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
