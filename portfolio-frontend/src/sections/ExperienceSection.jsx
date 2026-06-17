import { motion } from 'framer-motion';
import TimelineItem from '../components/ui/TimelineItem';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import { fadeIn } from '../animations/variants';
import { useContent } from '../context/ContentContext';

const ExperienceSection = () => {
  const { content } = useContent();
  const { experience, testimonials } = content;

  const categories = experience?.categories || [];
  const testimonialItems = testimonials?.items || [];

  return (
    <section id="experience" className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">{experience?.title || "Experience"}</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-2xl">{experience?.subtitle || ""}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-10">
        {categories.map((category, ci) => (
          <div key={ci}>
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">{category.name}</h3>
            <div className="space-y-6">
              {(category.items || []).map((item, idx) => (
                <TimelineItem key={idx} {...item} />
              ))}
            </div>
          </div>
        ))}

        {testimonialItems.length > 0 && (
          <div>
            <motion.div
              variants={fadeIn('up', 0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-6"
            >
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                {testimonials?.title || "Client Feedback"}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                {testimonials?.subtitle || ""}
              </p>
            </motion.div>

            <TestimonialsMarquee testimonials={testimonialItems} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
