export function generateStructuredData(heroName, hero, frontendUrl) {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: heroName,
    description: hero?.description || '',
    image: hero?.image || '',
    url: frontendUrl || '',
  };
  const sameAs = [];
  if (hero?.socialLinks?.length) {
    hero.socialLinks.forEach((s) => {
      if (s.url) sameAs.push(s.url);
    });
  }
  if (sameAs.length) base.sameAs = sameAs;
  return base;
}

export function propagateHeroToDependents(content) {
  const heroName = content.hero?.name;
  if (!heroName) return [];

  const affected = [];

  if (content.navbar) {
    content.navbar.brandName = heroName;
    affected.push('navbar');
  }

  if (content.footer) {
    content.footer.title = heroName;
    affected.push('footer');
  }

  if (content.seo) {
    const autoTitle = `${heroName} - Portfolio`;
    if (!content.seo.title) {
      content.seo.title = autoTitle;
    }
    affected.push('seo');
  }

  const frontendUrl = process.env.FRONTEND_URL || '';
  const newSD = generateStructuredData(heroName, content.hero, frontendUrl);
  content.structuredData = newSD;

  return [...new Set(affected)];
}
