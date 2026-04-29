import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createOwner(input: {
  name: string;
  username: string;
  password: string;
  roomId: string;
}) {
  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.$transaction(async (tx) => {
    const room = await tx.room.findUnique({ where: { id: input.roomId } });
    if (!room) throw new Error("ROOM_NOT_FOUND");
    if (room.isOccupied) throw new Error("ROOM_OCCUPIED");

    const existing = await tx.user.findUnique({ where: { username: input.username } });
    if (existing) throw new Error("USERNAME_TAKEN");

    const user = await tx.user.create({
      data: {
        username: input.username,
        passwordHash,
        name: input.name,
        role: "owner",
        roomId: input.roomId,
      },
    });

    await tx.room.update({
      where: { id: input.roomId },
      data: { isOccupied: true },
    });

    return user;
  });
}
