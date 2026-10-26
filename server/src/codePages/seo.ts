// Shared by the API and editor so optional image fields follow the same rules.
export const SOCIAL_IMAGE_HELP =
  "Leave blank, choose an image from your ZIP, or enter an HTTPS image URL or a site path such as /uploads/banner.webp.";

export const SOCIAL_IMAGE_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);
type ImageFile = { path: string; mime: string };

export function isSecureHttpsUrl(value: string) {
  if (
    !/^https:\/\//i.test(value) ||
    /[\s<>"'\\\u0000-\u001f\u007f]/.test(value)
  )
    return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function normalizeSocialImage(value: string) {
  return value.trim().replace(/^\.\//, "");
}

export function socialImageError(
  value: string,
  files?: readonly ImageFile[],
): string | undefined {
  const image = normalizeSocialImage(value);
  if (!image) return;
  if (image.length > 2048)
    return "The social-sharing image address is too long.";
  if (isSecureHttpsUrl(image)) return;
  if (image.startsWith("/") && !image.startsWith("//")) {
    try {
      const url = new URL(image, "https://chalapathiuniversity.edu.in");
      const decoded = decodeURIComponent(url.pathname);
      if (
        !/[\s<>"'\\\u0000-\u001f\u007f]/.test(image) &&
        !/[\\\u0000-\u001f\u007f]/.test(decoded) &&
        !decodeURIComponent(image.split(/[?#]/)[0]).split("/").includes("..") &&
        /\.(png|jpe?g|webp|gif|avif)$/i.test(decoded)
      )
        return;
    } catch {
      /* Report the field-specific guidance below. */
    }
  } else if (
    /^[a-zA-Z0-9_@. ()/\-]+\.(png|jpe?g|webp|gif|avif)$/i.test(image) &&
    image.split("/").every((segment) => !!segment && !segment.startsWith("."))
  ) {
    if (
      files &&
      !files.some(
        (file) => file.path === image && SOCIAL_IMAGE_MIMES.has(file.mime),
      )
    ) {
      return "This image is not in the current ZIP. Choose an available image, use an HTTPS URL or site path, or leave the field blank.";
    }
    return;
  }
  return "Choose an image from your ZIP, enter a full HTTPS image URL or a site path such as /uploads/banner.webp, or leave this optional field blank.";
}

export function resolveSocialImage(value: string, contentBaseUrl: string) {
  const image = normalizeSocialImage(value);
  if (!image || socialImageError(image)) return "";
  if (isSecureHttpsUrl(image)) return image;
  if (image.startsWith("/")) return new URL(image, contentBaseUrl).href;
  return new URL(
    image.split("/").map(encodeURIComponent).join("/"),
    contentBaseUrl,
  ).href;
}
