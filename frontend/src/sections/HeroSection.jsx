import React, { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContentStore } from '../store/contentStore';
import { HeroSkeleton } from '../components/SkeletonLoader';
import { AvailabilityBadge } from '../components/hero/AvailabilityBadge';
import { EditorialHeadline } from '../components/hero/EditorialHeadline';
import { HeroCTA } from '../components/hero/HeroCTA';
import { FloatingMetrics } from '../components/hero/FloatingMetrics';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Lazy-load the heavy 3D WebGL Canvas so critical editorial typography renders instantaneously
const LazyHeroCanvas = React.lazy(() => import('../components/hero/HeroCanvas'));

function Canvas3DPlaceholder() {
  return (
    <div className="w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[600px] flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Subtle pulsating architectural ring placeholder */}
        <div className="w-32 h-32 rounded-full border border-border-subtle animate-ping opacity-20" />
        <div className="absolute w-24 h-24 rounded-full border border-accent/30 animate-pulse" />
        <div className="absolute w-2 h-2 rounded-full bg-accent" />
      </div>
    </div>
  );
}

function ScrollDiscoveryIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="hidden md:flex flex-col items-center gap-2 pt-12 pb-4 text-content-muted select-none"
    >
      <span className="text-[11px] font-code tracking-widest uppercase text-content-muted/80">
        Explore Systems
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="w-5 h-8 rounded-full border border-border-subtle flex items-start justify-center p-1"
      >
        <div className="w-1 h-2 rounded-full bg-accent/80" />
      </motion.div>
    </motion.div>
  );
}

export const HeroSection = () => {
  const { content, loading, error, retry } = useContentStore();
  const { hero, resume } = content || {};

  // Cinematic sequence state: Mount 3D after initial critical typography paint
  const [mount3D, setMount3D] = useState(false);

  useEffect(() => {
    // 1.5s cinematic reveal sequence delay for 3D mounting to guarantee 100% smooth FCP
    const timer = setTimeout(() => {
      setMount3D(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading && !hero?.name) return <HeroSkeleton />;

  if (error && !hero?.name) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md p-8 rounded-lg bg-surface-base border border-border shadow-soft">
          <p className="text-sm font-medium text-warning">{error}</p>
          <button
            onClick={retry}
            className="px-6 py-2.5 rounded-md bg-accent text-accent-foreground font-medium text-sm transition-colors hover:bg-accent-hover"
          >
            Retry Connection
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between pt-16 md:pt-24 lg:pt-28 pb-12 overflow-hidden bg-noise"
    >
      {/* 0.0s Atmospheric Aurora and Radial Spotlight Background Layers */}
      <div className="absolute inset-0 bg-aurora pointer-events-none -z-10" aria-hidden="true" />
      <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-radial-glow opacity-80 pointer-events-none -z-10" aria-hidden="true" />

      {/* 12-Column Responsive Editorial Container */}
      <div className="editorial-container flex-grow flex items-center w-full z-10">
        <div className="editorial-grid w-full items-center">
          {/* Left: 7 Columns Editorial Storytelling */}
          <div className="col-span-12 lg:col-span-7 space-y-7 lg:space-y-9 pr-0 lg:pr-6">
            {/* 0.8s Availability Badge */}
            <AvailabilityBadge statusText="Available for Engineering Roles & Systems Architecture" />

            {/* 0.3s Monumental Editorial Headline */}
            <EditorialHeadline hero={hero} />

            {/* 0.8s Product-Level Actions (Magnetic CTA + Resume) */}
            <HeroCTA cta={hero?.cta} resumeUrl={resume?.url} />

            {/* Floating Senior Engineering Metrics */}
            <FloatingMetrics />
          </div>

          {/* Right: 5 Columns Signature Engineering Constellation (3D) */}
          <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative"
            >
              {mount3D ? (
                <ErrorBoundary fallback={<Canvas3DPlaceholder />}>
                  <Suspense fallback={<Canvas3DPlaceholder />}>
                    <LazyHeroCanvas />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <Canvas3DPlaceholder />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Editorial Scroll Discovery Anchor */}
      <div className="w-full flex justify-center z-10">
        <ScrollDiscoveryIndicator />
      </div>
    </section>
  );
};

export default HeroSection;
