import { prisma } from "@/lib/db";
import { formatRoomId } from "@/lib/models/room";

const CONFIG_ID = 1;

export async function getCondoConfig() {
  return prisma.condoConfig.upsert({
    where: { id: CONFIG_ID },
    update: {},
    create: { id: CONFIG_ID, totalRooms: 0, isInitialized: false },
  });
}

export async function initializeCondo(totalRooms: number) {
  if (!Number.isInteger(totalRooms) || totalRooms < 1 || totalRooms > 999) {
    throw new Error("INVALID_ROOM_COUNT");
  }

  const config = await getCondoConfig();
  if (config.isInitialized) throw new Error("ALREADY_INITIALIZED");

  const roomIds = Array.from({ length: totalRooms }, (_, i) => formatRoomId(i + 1));

  await prisma.$transaction([
    prisma.room.createMany({
      data: roomIds.map((id) => ({ id, isOccupied: false })),
    }),
    prisma.condoConfig.update({
      where: { id: CONFIG_ID },
      data: { totalRooms, isInitialized: true },
    }),
  ]);

  return { totalRooms, roomsCreated: roomIds };
}
