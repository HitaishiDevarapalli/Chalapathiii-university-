/**
 * High performance client-side image compression using HTML5 Canvas.
 * Compresses camera/phone photos (5MB - 15MB) into high-quality, lightweight images (~40KB - 120KB).
 * Prevents LocalStorage QuotaExceededError and drastically accelerates site load speed.
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export async function compressImage(
  fileOrDataUrl: File | Blob | string,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1400,
    maxHeight = 1000,
    quality = 0.82,
    mimeType = "image/jpeg"
  } = options;

  return new Promise((resolve) => {
    // If it's a URL path or svg, return as is
    if (typeof fileOrDataUrl === "string") {
      if (
        fileOrDataUrl.startsWith("/") || 
        fileOrDataUrl.startsWith("http://") || 
        fileOrDataUrl.startsWith("https://") || 
        fileOrDataUrl.startsWith("data:image/svg+xml")
      ) {
        return resolve(fileOrDataUrl);
      }
    }

    const img = new Image();

    const processImage = () => {
      try {
        let { width, height } = img;
        if (!width || !height) {
          width = 800;
          height = 600;
        }

        // Calculate aspect ratio preserving scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback to original
          if (typeof fileOrDataUrl === "string") return resolve(fileOrDataUrl);
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || "");
          reader.readAsDataURL(fileOrDataUrl as Blob);
          return;
        }

        // Smooth resizing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // If output is JPEG, fill white background for transparent PNGs
        if (mimeType === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Fallback
        if (typeof fileOrDataUrl === "string") return resolve(fileOrDataUrl);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || "");
        reader.readAsDataURL(fileOrDataUrl as Blob);
      }
    };

    img.onload = processImage;
    img.onerror = () => {
      // Fallback
      if (typeof fileOrDataUrl === "string") return resolve(fileOrDataUrl);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || "");
      reader.readAsDataURL(fileOrDataUrl as Blob);
    };

    if (typeof fileOrDataUrl === "string") {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          img.src = e.target.result;
        } else {
          resolve("");
        }
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
