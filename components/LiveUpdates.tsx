"use client";

// Mounts an EventSource connection to /api/events.
// On any incoming event, calls router.refresh() so the surrounding
// server components re-fetch and re-render.
//
// Renders nothing — drop into any page that should react to live updates.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LiveUpdates() {
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource("/api/events");
    source.onmessage = () => router.refresh();
    return () => source.close();
  }, [router]);

  return null;
}
