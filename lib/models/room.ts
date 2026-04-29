import { prisma } from "@/lib/db";

export async function listRooms(filter?: { available?: boolean; occupied?: boolean }) {
  const where: { isOccupied?: boolean } = {};
  if (filter?.available) where.isOccupied = false;
  if (filter?.occupied) where.isOccupied = true;
  return prisma.room.findMany({ where, orderBy: { id: "asc" } });
}

export async function listRoomsWithOwner() {
  return prisma.room.findMany({
    orderBy: { id: "asc" },
    include: { user: { select: { id: true, name: true, username: true } } },
  });
}

export async function getRoom(id: string) {
  return prisma.room.findUnique({ where: { id } });
}

export function formatRoomId(n: number): string {
  return `R${String(n).padStart(3, "0")}`;
}
