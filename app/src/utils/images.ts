/**
 * Image optimization utilities.
 * - Enhances Unsplash URLs to request WebP + compressed sizes
 * - Prevents duplicate downloads through CDN params
 * - Adds lazy loading attributes
 */

// Unsplash CDN optimization: request WebP format and appropriate size
export function optimizeImage(url: string | undefined, width: number = 600): string {
  if (!url) return '';
  
  // Unsplash images - add auto=format (WebP) and width params
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?q=60&w=${width}&auto=format&fit=crop`;
  }
  
  // Cloudinary images - add format conversion
  if (url.includes('cloudinary.com')) {
    // Insert f_auto,q_60,w_{width} params into Cloudinary URL
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/f_auto,q_60,w_${width}/${parts[1]}`;
    }
  }
  
  // Supabase storage images - return as-is (public URLs don't support transform params)
  // Note: Supabase image transformations require the /render/image/ endpoint
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }
  
  return url;
}

// Lazy loading props for images
export function lazyImgProps(src: string, width: number = 600) {
  return {
    src: optimizeImage(src, width),
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}

// IntersectionObserver-based lazy loading helper (STEP 7)
// Only loads images when they scroll into view
export function createLazyImageObserver(callback: (img: HTMLImageElement) => void): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          callback(img);
          (entry.target as any)._yyObserver?.unobserve(img);
        }
      });
    },
    { rootMargin: '200px' }
  );
}