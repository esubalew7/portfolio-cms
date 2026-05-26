import React from 'react';
import TimelineItem from '../components/ui/TimelineItem';

const ExperienceSection = () => {
  /*const internship = [
    {
      role: 'MERN Stack Developer Intern',
      company: 'Alyah Software Company',
      duration: 'Jun 2024 — Sep 2024',
      location: 'Bahir Dar/ Ethiopia',
      tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind'],
      bullets: [
        'Built responsive UI components and implemented REST APIs for internal tools.',
        'Optimized frontend performance and reduced bundle size for faster load times.',
        'Collaborated closely with product and QA to ship production-ready features.',
      ],
      logo: '',
    },
  ]; */

  const education = [
    {
      role: 'Computer Science Student',
      company: 'Bahir Dar University',
      duration: '2024 — Present',
      location: 'Bahir Dar, Ethiopia',
      tags: ['Algorithms', 'Data Structures', 'Databases'],
      bullets: ['Relevant coursework: Web Dev, Databases, Algorithms, Software Engineering'],
      logo: '',
    },
  ];

  const certifications = [
    {
      role: 'Front-End Development Certification',
      company: 'Certification Provider',
      duration: '2025',
      location: '',
      tags: ['React', 'JavaScript', 'CSS', 'HTML'],
      bullets: [''],
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
      {/*   <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Internship Experience</h3>
          <div className="space-y-6">
            {internship.map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </div>
        </div> */}

        <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Education</h3>
          <div className="space-y-6">
            {education.map((item, idx) => (
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

       {/* <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Freelance / Projects</h3>
          <div className="space-y-6">
            {projects.map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default ExperienceSection;
