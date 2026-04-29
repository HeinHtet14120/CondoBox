"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  value: string;
  size?: number;
}

export default function QRDisplay({ value, size = 220 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, { width: size, margin: 1, color: { dark: "#0b0b0f", light: "#ffffff" } })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <div className="qr-frame" style={{ width: size + 28, height: size + 28 }}>
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="QR code" width={size} height={size} style={{ display: "block" }} />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            background: "var(--bg-muted)",
            borderRadius: 8,
          }}
        />
      )}
    </div>
  );
}
