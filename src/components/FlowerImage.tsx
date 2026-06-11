import React, { useState, useEffect, useRef } from 'react';

interface FlowerImageProps {
  flowerName: string;
  photoIds?: string[];
  originalImage?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const GLOBAL_BACKUPS = [
  '1518709268805-4e9042af9f23',
  '1548094990-c16ca90f1f0d',
  '1508193638397-1c4234db14d8',
  '1597848212624-a19eb35e2651',
  '1566694271453-390536dd1f0d'
];

const FlowerImage: React.FC<FlowerImageProps> = ({ 
  flowerName, 
  photoIds = [], 
  originalImage,
  alt, 
  className = "", 
  width = 600, 
  height = 800 
}) => {
  const [stage, setStage] = useState(0); // 0: photoIds, 1: original, 2: global, 3: svg
  const [subIndex, setSubIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // SVG Fallback Data URL
  const svgMarkup = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${flowerName || 'Flower'}</text></svg>`;
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;

  const getSrc = () => {
    const sizeParams = `w=${width}&h=${height}&fit=crop&auto=format&q=80`;
    
    // Stage 0: photoIds
    if (stage === 0) {
      if (photoIds && photoIds.length > subIndex) {
        return `https://images.unsplash.com/photo-${photoIds[subIndex]}?${sizeParams}`;
      }
      return null; // Move to next stage
    }
    
    // Stage 1: originalImage
    if (stage === 1) {
      return originalImage || null;
    }
    
    // Stage 2: global backups
    if (stage === 2) {
      if (GLOBAL_BACKUPS.length > subIndex) {
        return `https://images.unsplash.com/photo-${GLOBAL_BACKUPS[subIndex]}?${sizeParams}`;
      }
      return null;
    }
    
    // Stage 3: SVG
    return svgDataUrl;
  };

  useEffect(() => {
    // If current stage has no source, move to next stage
    if (getSrc() === null) {
      if (stage < 3) {
        setStage(prev => prev + 1);
        setSubIndex(0);
      } else {
        setIsLoading(false);
      }
    }
  }, [stage, subIndex, photoIds, originalImage]);

  const handleError = () => {
    if (stage === 0) {
      if (photoIds && subIndex < photoIds.length - 1) {
        setSubIndex(prev => prev + 1);
      } else {
        setStage(1);
        setSubIndex(0);
      }
    } else if (stage === 1) {
      setStage(2);
      setSubIndex(0);
    } else if (stage === 2) {
      if (subIndex < GLOBAL_BACKUPS.length - 1) {
        setSubIndex(prev => prev + 1);
      } else {
        setStage(3);
        setSubIndex(0);
      }
    } else {
      setIsLoading(false);
    }
  };

  const src = getSrc() || svgDataUrl;

  return (
    <div className={`relative overflow-hidden bg-bloom-cream ${className}`}>
      <div className={`absolute inset-0 skeleton-loader z-10 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      
      <img
        key={src}
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default FlowerImage;
