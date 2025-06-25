import { PrismaClient } from "@prisma/client";
import { User } from "../models/user";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

export const createUser = async (
  data: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User | null> => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // Prisma error for record not found
      return null;
    }
    throw err;
  }
};

export const deleteUser = async (id: string): Promise<User | null> => {
  try {
    return await prisma.user.delete({ where: { id } });
  } catch (err: any) {
    if (err.code === "P2025") {
      // Prisma error for record not found
      return null;
    }
    throw err;
  }
};
