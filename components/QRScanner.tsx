"use client";

import { useEffect, useRef } from "react";

interface Props {
  onScan: (text: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  const containerId = "qr-scanner-region";
  const scannerRef = useRef<{ stop?: () => Promise<void> } | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;

      const instance = new Html5Qrcode(containerId);
      scannerRef.current = instance;

      try {
        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 240 },
          (decoded) => {
            onScan(decoded);
            instance.stop().catch(() => {});
          },
          () => {},
        );
      } catch (e) {
        console.warn("Camera unavailable:", e);
      }
    })();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s?.stop) s.stop().catch(() => {});
    };
  }, [onScan]);

  return <div id={containerId} className="w-full max-w-sm rounded border border-slate-200" />;
}
