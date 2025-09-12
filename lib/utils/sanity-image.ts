import { urlFor } from "@/lib/sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Generate optimized Sanity image URLs with fallback support
 */
export function getTeamImageUrl(
  imageSource: SanityImageSource | string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    fallback?: string;
  } = {}
): string {
  const {
    width = 200,
    height = 200,
    quality = 80,
    format = 'auto',
    fallback = '/placeholder.svg'
  } = options;

  // Return fallback if no image source
  if (!imageSource) {
    return fallback;
  }

  // If it's already a string URL, return as-is (for backwards compatibility)
  if (typeof imageSource === 'string' && imageSource.startsWith('http')) {
    return imageSource;
  }

  try {
    // Build Sanity image URL with optimizations
    let imageBuilder = urlFor(imageSource)
      .width(width)
      .height(height)
      .quality(quality)
      .fit('crop')
      .crop('center');

    // Add format if specified
    if (format !== 'auto') {
      imageBuilder = imageBuilder.format(format);
    }

    return imageBuilder.url();
  } catch (error) {
    console.warn('Failed to generate Sanity image URL:', error);
    return fallback;
  }
}

/**
 * Preset configurations for common team image sizes
 */
export const teamImagePresets = {
  thumbnail: { width: 48, height: 48 },
  small: { width: 96, height: 96 },
  medium: { width: 200, height: 200 },
  large: { width: 400, height: 400 },
  hero: { width: 800, height: 600 },
} as const;

/**
 * Get team logo URL with preset sizes
 */
export function getTeamLogoUrl(
  imageSource: SanityImageSource | string | null | undefined,
  preset: keyof typeof teamImagePresets = 'medium',
  fallback = '/placeholder-team.png'
): string {
  return getTeamImageUrl(imageSource, {
    ...teamImagePresets[preset],
    fallback,
  });
}
