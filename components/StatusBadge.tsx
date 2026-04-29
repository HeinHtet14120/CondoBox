import { Icon } from "./Icon";

interface Props {
  status: "waiting" | "picked_up" | string;
}

export default function StatusBadge({ status }: Props) {
  if (status === "waiting") {
    return (
      <span className="badge badge-waiting">
        <span className="badge-dot" />
        Waiting
      </span>
    );
  }
  if (status === "picked_up") {
    return (
      <span className="badge badge-picked">
        <Icon.Check size={12} strokeWidth={3} />
        Picked up
      </span>
    );
  }
  return <span className="badge">{status}</span>;
}
