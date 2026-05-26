/**
 * Script to create a sample Flutter project in the database.
 * Usage: NODE_ENV=development node scratch/create_sample_project.js
 */
import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import Project from '../models/Project.js';

const sample = {
  title: 'Local Service Finder Mobile App',
  description: 'A cross-platform service marketplace mobile application built with Flutter featuring authentication, real-time booking, provider management, and responsive modern UI.',
  category: 'mobile',
  technologies: ['Flutter', 'Dart', 'Firebase'],
  image: 'https://images.unsplash.com/photo-1523475496153-3d6ccf3a1d53?auto=format&fit=crop&q=80&w=1600',
  imagePublicId: '',
  liveLink: '',
  githubLink: '',
};

const run = async () => {
  try {
    await connectDB();

    const exists = await Project.findOne({ title: sample.title });
    if (exists) {
      console.log('Sample project already exists:', exists.title);
      process.exit(0);
    }

    const created = await Project.create(sample);
    console.log('Created sample project:', created.title);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create sample project:', err);
    process.exit(1);
  }
};

run();
