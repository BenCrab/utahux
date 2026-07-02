import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from 'sanity:client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** Mirrors the Webflow responsive-variant widths. */
export const SRCSET_WIDTHS = [500, 800, 1080, 1600, 2000, 2600];

interface SrcsetInput {
  url: string;
  width?: number;
}

/**
 * srcset from a raw Sanity CDN asset url, capped at the asset's native width.
 * SVGs are returned as-is (Sanity serves them verbatim).
 */
export function sanitySrcset({ url, width }: SrcsetInput): string | undefined {
  if (url.endsWith('.svg')) return undefined;
  const widths = SRCSET_WIDTHS.filter((w) => !width || w < width);
  if (width) widths.push(width);
  if (widths.length <= 1) return undefined;
  return widths
    .map((w) => `${url}?w=${w}&auto=format&q=75&fit=max ${w}w`)
    .join(', ');
}

export function sanitySrc(url: string): string {
  if (url.endsWith('.svg')) return url;
  return `${url}?auto=format&q=75&fit=max`;
}
