import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

export default function SEO({ 
  title, 
  description, 
  name = "Chalapathi University", 
  type = "website", 
  image = "https://chalapathiuniversity.edu.in/logo.png",
  url = "https://chalapathiuniversity.edu.in/",
  keywords = "Chalapathi University, ChalapathiUniversity, Chalapathi University Andhra Pradesh, Chalapathi University Guntur, Chalapathi college, Chalapathi clg"
}: SEOProps) {
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel='canonical' href={url} />
      
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
    </Helmet>
  );
}
