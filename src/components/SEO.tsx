import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title, 
  description, 
  name = "Chalapathi University", 
  type = "website", 
  image = "https://chalapathiuniversity.edu.in/logo.png",
  url = "https://chalapathiuniversity.edu.in/"
}: SEOProps) {
  
  // JSON-LD Structured Data for Google Rich Snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": name,
    "url": url,
    "logo": "https://chalapathiuniversity.edu.in/logo.png",
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guntur",
      "addressRegion": "Andhra Pradesh",
      "addressCountry": "IN"
    }
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
