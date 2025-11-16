"use client";

import React, { useState } from "react";

type Props = {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function Avatar({ src, alt = "avatar", width = 40, height = 40, className = "" }: Props) {
  const fallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        width +
        '" height="' +
        height +
        '" viewBox="0 0 24 24"><rect width="100%" height="100%" fill="#e5e7eb" rx="6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="10">User</text></svg>'
    );

  const [current, setCurrent] = useState<string>(src || fallback);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        const t = e.currentTarget as HTMLImageElement;
        if (t.src !== fallback) t.src = fallback;
      }}
    />
  );
}
