import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";

export async function createParcel(data: {
  roomId: string;
  sender: string;
  description: string;
}) {
  const room = await prisma.room.findUnique({ where: { id: data.roomId } });
  if (!room) throw new Error("ROOM_NOT_FOUND");
  if (!room.isOccupied) throw new Error("ROOM_NOT_OCCUPIED");

  return prisma.parcel.create({
    data: {
      ...data,
      qrCode: uuidv4(),
    },
  });
}

export async function getParcelById(id: string) {
  return prisma.parcel.findUnique({
    where: { id },
    include: {
      room: { include: { user: { select: { id: true, name: true } } } },
    },
  });
}

export async function getParcelByQrCode(qrCode: string) {
  return prisma.parcel.findUnique({
    where: { qrCode },
    include: {
      room: { include: { user: { select: { id: true, name: true } } } },
    },
  });
}

export async function listAllParcels(status?: "waiting" | "picked_up") {
  return prisma.parcel.findMany({
    where: status ? { status } : undefined,
    orderBy: { arrivedAt: "desc" },
    include: {
      room: { include: { user: { select: { id: true, name: true } } } },
    },
  });
}

export async function listParcelsByRoom(roomId: string, status?: "waiting" | "picked_up") {
  return prisma.parcel.findMany({
    where: { roomId, ...(status ? { status } : {}) },
    orderBy: { arrivedAt: "desc" },
  });
}

export async function markParcelPickedUp(id: string) {
  const result = await prisma.parcel.updateMany({
    where: { id, status: "waiting" },
    data: { status: "picked_up", pickedUpAt: new Date() },
  });
  if (result.count === 0) throw new Error("ALREADY_PICKED_UP_OR_MISSING");
  return prisma.parcel.findUnique({ where: { id } });
}
