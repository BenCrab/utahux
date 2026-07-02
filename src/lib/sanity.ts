import { sanityClient } from 'sanity:client';

const configured = sanityClient.config().projectId !== 'placeholder';

/**
 * Build-time fetch. Before the Sanity project is initialized
 * (PUBLIC_SANITY_PROJECT_ID unset) every query resolves to `fallback`
 * so the site still builds with empty content.
 */
export async function loadQuery<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!configured) return fallback;
  return sanityClient.fetch<T>(query, params);
}
