export const HeroSkeleton = () => (
  <section className="relative min-h-screen flex items-center justify-center py-0 lg:py-10 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-1 relative z-10 w-full max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-28">
        <div className="w-full md:w-1/2 lg:w-1/2 space-y-6 md:space-y-8 text-center md:text-left flex flex-col items-center md:items-start lg:pl-12">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-16 w-72 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-12 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-6 w-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="flex gap-4 pt-4">
            <div className="h-14 w-40 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-14 w-44 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 pt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center md:justify-end mt-8 md:mt-0">
          <div className="w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

export const AboutSkeleton = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 max-w-6xl">
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto" />
        <div className="h-1 w-20 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse" />
      </div>
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-5/12">
          <div className="aspect-[4/5] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
        <div className="w-full lg:w-7/12 space-y-8">
          <div className="space-y-6">
            <div className="h-10 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-4/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-12 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const SkillsSkeleton = () => (
  <section className="container mx-auto px-4 py-10 md:py-20 max-w-7xl">
    <div className="text-center mb-16 space-y-4">
      <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto" />
      <div className="h-1 w-20 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse" />
      <div className="h-5 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ExperienceSkeleton = () => (
  <section className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
    <div className="space-y-4 mb-10">
      <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-5 w-72 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
    </div>
    <div className="space-y-8">
      {[...Array(2)].map((_, i) => (
        <div key={i}>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
          <div className="space-y-6">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-start gap-4 md:gap-6">
                <div className="flex flex-col items-center w-8 md:w-10 flex-shrink-0">
                  <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="w-px h-full bg-gray-200 dark:bg-gray-800 mt-2" />
                </div>
                <div className="flex-1 bg-white dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/50 rounded-2xl p-4 md:p-6">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const ContactSkeleton = () => (
  <section className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">
        <div className="w-full lg:w-[40%] space-y-10">
          <div className="space-y-4">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-5 w-72 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-5 p-2">
                <div className="h-14 w-14 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[55%]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="h-12 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
