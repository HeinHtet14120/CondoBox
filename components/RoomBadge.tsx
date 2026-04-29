interface Props {
  room: string;
}

export default function RoomBadge({ room }: Props) {
  return <span className="badge badge-room">{room}</span>;
}
