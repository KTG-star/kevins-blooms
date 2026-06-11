import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Kelvin's Blooms | Premium Flower Delivery", 
  description = "Experience the magic of Kelvin's Blooms. Hand-crafted bouquets, same-day delivery, and the freshest flowers for every occasion.",
  ogTitle,
  ogDescription,
  ogImage = "https://kevins-blooms-afow.vercel.app/og-image.jpg",
  canonical
}) => {
  const siteTitle = title.includes("Kelvin's Blooms") ? title : `${title} | Kelvin's Blooms`;
  const url = canonical || window.location.href;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={ogTitle || siteTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={ogTitle || siteTitle} />
      <meta property="twitter:description" content={ogDescription || description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
