/** Shared image processor for portraits + homebrew content images.
 *  Center-crops to a square and scales down to a target pixel size, returning a JPEG data URL.
 *  Keeps base64 payloads small enough to store inside IndexedDB/Supabase JSONB. */

/** Max accepted source file size (before crop/scale). */
export const MAX_IMAGE_FILE_BYTES = 3 * 1024 * 1024; // 3 MB

/** Accepted MIME types. */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'] as const;

export interface ProcessImageOptions {
  /** Output square side length in pixels. Default 300 (good for stat-block illustrations). */
  size?: number;
  /** JPEG quality 0–1. Default 0.9. */
  quality?: number;
}

/** Center-crops the image to a square then scales it to `size × size` JPEG.
 *  Returns a base64 data URL. */
export function processSquareImage(file: File, opts: ProcessImageOptions = {}): Promise<string> {
  const outSize = opts.size ?? 300;
  const quality = opts.quality ?? 0.9;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode the image.'));
      img.onload = () => {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - side) / 2;
        const sy = (img.naturalHeight - side) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = outSize;
        canvas.height = outSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas unavailable.')); return; }

        ctx.drawImage(img, sx, sy, side, side, 0, 0, outSize, outSize);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Validate a File against accepted types + size. Returns null if OK, or an error message. */
export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return 'Please select a PNG, JPEG, GIF, or WebP image.';
  }
  if (file.size > MAX_IMAGE_FILE_BYTES) {
    return 'Image must be 3 MB or smaller.';
  }
  return null;
}
