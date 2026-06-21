import { Helmet } from 'react-helmet-async';
import { useContentStore } from '../store/contentStore';

export const SEOHead = () => {
  const content = useContentStore((s) => s.content);
  const seo = content?.seo || {};
  const structuredData = content?.structuredData || {};
  const hero = content?.hero || {};

  const title = seo.title || `${hero.name || 'Portfolio'} - Portfolio`;
  const description = seo.description || hero.description || '';
  const ogImage = seo.ogImage || hero.image || '';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {structuredData['@context'] && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
