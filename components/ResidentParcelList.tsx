"use client";

import { useState } from "react";
import ParcelCard from "./ParcelCard";
import ParcelDetailSheet from "./ParcelDetailSheet";
import StatusBadge from "./StatusBadge";
import { Icon } from "./Icon";

export interface ResidentParcel {
  id: string;
  qrCode: string;
  roomId: string;
  sender: string;
  description: string;
  status: string;
  arrivedAt: string;
  pickedUpAt: string | null;
}

interface Props {
  parcels: ResidentParcel[];
  /** When true, picked-up parcels render as a compact "history" row instead of a full card. */
  compactPickedUp?: boolean;
}

function shortDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResidentParcelList({ parcels, compactPickedUp = false }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = parcels.find((p) => p.id === openId) ?? null;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {parcels.map((p) => {
          if (compactPickedUp && p.status === "picked_up") {
            return (
              <button
                key={p.id}
                onClick={() => setOpenId(p.id)}
                style={{
                  textAlign: "left",
                  background: "var(--bg-elev)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  font: "inherit",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: "var(--emerald-soft)",
                    color: "var(--emerald)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon.Check size={18} strokeWidth={3} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "var(--text)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.sender}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.description}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status="picked_up" />
                  <div
                    style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}
                  >
                    {shortDate(p.pickedUpAt)}
                  </div>
                </div>
              </button>
            );
          }

          return (
            <ParcelCard
              key={p.id}
              variant="resident"
              onClick={() => setOpenId(p.id)}
              parcel={{
                id: p.id,
                qrCode: p.qrCode,
                roomId: p.roomId,
                sender: p.sender,
                description: p.description,
                status: p.status,
                arrivedAt: p.arrivedAt,
                pickedUpAt: p.pickedUpAt,
              }}
            />
          );
        })}
      </div>
      <ParcelDetailSheet parcel={open} onClose={() => setOpenId(null)} />
    </>
  );
}
