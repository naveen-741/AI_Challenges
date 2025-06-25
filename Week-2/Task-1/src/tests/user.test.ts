import * as userService from "../services/userService";
import { PrismaClient } from "@prisma/client";

describe("User Service", () => {
  const prisma = new PrismaClient();
  let userId: string;

  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123",
  };

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new user", async () => {
    const user = await userService.createUser(testUser);
    expect(user).toHaveProperty("id");
    expect(user.email).toBe(testUser.email);
    userId = user.id;
  });

  it("should not create a user with duplicate email", async () => {
    await expect(userService.createUser(testUser)).rejects.toThrow();
  });

  it("should get all users", async () => {
    const users = await userService.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  it("should get a user by id", async () => {
    const user = await userService.getUserById(userId);
    expect(user).not.toBeNull();
    if (user) {
      expect(user.id).toBe(userId);
    }
  });

  it("should return null for non-existent user by id", async () => {
    const user = await userService.getUserById("non-existent-id");
    expect(user).toBeNull();
  });

  it("should update a user", async () => {
    const updated = await userService.updateUser(userId, {
      name: "Updated Name",
    });
    expect(updated).not.toBeNull();
    if (updated) {
      expect(updated.name).toBe("Updated Name");
    }
  });

  it("should return null when updating a non-existent user", async () => {
    const updated = await userService.updateUser("non-existent-id", {
      name: "No User",
    });
    expect(updated).toBeNull();
  });

  it("should delete a user", async () => {
    const deleted = await userService.deleteUser(userId);
    expect(deleted).not.toBeNull();
    if (deleted) {
      expect(deleted.id).toBe(userId);
    }
    // Should not find the user anymore
    const user = await userService.getUserById(userId);
    expect(user).toBeNull();
  });

  it("should return null when deleting a non-existent user", async () => {
    const deleted = await userService.deleteUser("non-existent-id");
    expect(deleted).toBeNull();
  });
});
