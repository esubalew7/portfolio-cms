import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ExperienceSection from '../sections/ExperienceSection';

const Experience = () => {
  return (
    <MainLayout>
      <main className="min-h-screen py-12">
        <ExperienceSection />
      </main>
    </MainLayout>
  );
};

export default Experience;
