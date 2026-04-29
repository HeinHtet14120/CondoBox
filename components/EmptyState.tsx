import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface Props {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, body, action }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "36px 20px",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--bg-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-tertiary)",
          marginBottom: 14,
        }}
      >
        {icon ?? <Icon.Inbox size={24} />}
      </div>
      <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, maxWidth: 280, lineHeight: 1.5 }}>{body}</div>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}
