import React, { useMemo } from 'react';
import { useContentStore } from '../store/contentStore';
import { ExperienceTimeline } from '../components/experience/ExperienceTimeline';
import { ExperienceSkeleton } from '../components/SkeletonLoader';

const ExperienceSection = () => {
  const { content, loading, error, retry } = useContentStore();
  const { experience } = content;

  const items = useMemo(() => {
    const categories = experience?.categories || [];
    const allItems = [];
    for (const cat of categories) {
      for (const item of cat.items || []) {
        allItems.push(item);
      }
    }
    return allItems;
  }, [experience]);

  if (loading) return <ExperienceSkeleton />;
  if (error) return (
    <section id="experience" className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <button onClick={retry} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">
          Retry
        </button>
      </div>
    </section>
  );

  if (items.length === 0) return null;

  return <ExperienceTimeline items={items} />;
};

export default ExperienceSection;
