/** Battle-map image processing.
 *
 *  Deliberately NOT src/lib/imageProcessing.ts: that one centre-crops to a square,
 *  which is right for portraits and monster art and catastrophic for a map. Maps
 *  keep their aspect ratio and are only downscaled on the long edge.
 */

/** Max accepted source file size (before downscale). Maps are legitimately larger
 *  than the 3 MB portrait limit — a 4000×3000 PNG map pack export runs 10–20 MB. */
export const MAX_MAP_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

export const ACCEPTED_MAP_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

/** Longest-edge cap for the stored image.
 *
 *  2048 comfortably covers a 40×30 grid at ~50 px/square, and the commercial map
 *  packs sampled for this feature top out around 1850 px on the long edge, so this
 *  is a superset of real source art rather than a downgrade. Bigger buys nothing on
 *  a tablet screen and costs Supabase Storage (1 GB free) and page memory. */
export const MAX_MAP_EDGE = 2048;

/** JPEG quality for the stored map. 0.82 keeps a 2048px map in the 300–700 KB band. */
export const MAP_JPEG_QUALITY = 0.82;

export interface ProcessedMapImage {
  blob: Blob;
  width: number;
  height: number;
}

/** Validate a File against accepted types + size. Returns null if OK, or an error message. */
export function validateMapFile(file: File): string | null {
  if (!(ACCEPTED_MAP_TYPES as readonly string[]).includes(file.type)) {
    return 'Please select a PNG, JPEG, or WebP image.';
  }
  if (file.size > MAX_MAP_FILE_BYTES) {
    return 'Map image must be 25 MB or smaller.';
  }
  return null;
}

/**
 * Downscale (never upscale) so the longest edge is at most MAX_MAP_EDGE, preserving
 * aspect ratio, and re-encode as JPEG. Returns a Blob plus the final dimensions —
 * callers need the dimensions to store on the BattleMap record, since every grid
 * calculation is expressed in source-image pixels.
 */
export function processMapImage(file: File): Promise<ProcessedMapImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode the image.'));
    };

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { naturalWidth: sw, naturalHeight: sh } = img;
      if (!sw || !sh) {
        reject(new Error('Image has no dimensions.'));
        return;
      }

      // Scale down only — a small map stays at its native size rather than being
      // blown up into a blurry larger file.
      const scale = Math.min(1, MAX_MAP_EDGE / Math.max(sw, sh));
      const width = Math.round(sw * scale);
      const height = Math.round(sh * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable.'));
        return;
      }

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not encode the image.'));
            return;
          }
          resolve({ blob, width, height });
        },
        'image/jpeg',
        MAP_JPEG_QUALITY,
      );
    };

    img.src = url;
  });
}

/** Human-readable size for the upload UI, e.g. "412 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
