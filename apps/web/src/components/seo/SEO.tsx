import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishDate?: string;
  tags?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Tribes - Private Social Platform',
  description = 'Create and join exclusive, invite-only communities. Connect with like-minded individuals in a secure, private environment.',
  keywords = 'private communities, social platform, exclusive groups, tribe building, secure networking',
  image = 'https://home.intellisyncsolutions.io/og-image.jpg',
  url = 'https://home.intellisyncsolutions.io',
  type = 'website',
  author = 'Intellisync Solutions',
  publishDate = new Date().toISOString(),
  tags = [],
}) => {
  const fullTitle = `${title} | Powered by Intellisync Solutions`;

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://home.intellisyncsolutions.io'
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Tribes" />
      {publishDate && <meta property="article:published_time" content={publishDate} />}
      {tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@intellisyncsol" />
      <meta name="twitter:site" content="@intellisyncsol" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Alternate Language Links (if applicable) */}
      <link rel="alternate" hrefLang="en" href={url} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: title,
          description: description,
          url: url,
          image: image,
          author: {
            '@type': 'Organization',
            name: author,
            url: 'https://home.intellisyncsolutions.io'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Intellisync Solutions',
            url: 'https://home.intellisyncsolutions.io',
            logo: {
              '@type': 'ImageObject',
              url: 'https://home.intellisyncsolutions.io/logo.png'
            }
          },
          datePublished: publishDate
        })}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};
