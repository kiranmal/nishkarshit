/**
 * Delivers Cloudinary images in the smallest suitable format (WebP/AVIF automatically) and a sensible width —
 * a big win on phones. Any other URL (local /public files, other hosts) is returned unchanged.
 */
export function optimizeImage(url: string | undefined | null, width = 1200): string {
  if (!url) return "";
  const m = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/.exec(url);
  if (!m) return url;
  const rest = m[2];
  // Already has a transformation segment (e.g. "w_300,c_fill/…"): leave the admin's choice alone.
  if (/^[a-z]{1,3}_[^/]*\//.test(rest) && !/^v\d+\//.test(rest)) return url;
  return `${m[1]}f_auto,q_auto,w_${width}/${rest}`;
}
