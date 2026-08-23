import { imageUrl, toSrcSet } from "../utils/cloudinaryImage.js";

export default function ResponsiveImage({
  media,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  loading = "lazy"
}) {
  const src = imageUrl(media);

  if (!src) return null;

  return (
    <img
      src={src}
      srcSet={toSrcSet(media)}
      sizes={sizes}
      alt={alt || media?.altText || ""}
      width={media?.width}
      height={media?.height}
      loading={loading}
      className={className}
    />
  );
}
