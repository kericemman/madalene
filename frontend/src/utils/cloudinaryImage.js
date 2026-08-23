export const toSrcSet = (media) =>
  media?.srcset?.map((item) => `${item.url} ${item.width}w`).join(", ") || undefined;

export const imageUrl = (media, fallback = "") => media?.optimizedUrl || media?.secureUrl || fallback;
