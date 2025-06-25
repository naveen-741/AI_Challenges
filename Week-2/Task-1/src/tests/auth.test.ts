import * as authService from "../services/authService";
import { PrismaClient } from "@prisma/client";

describe("Auth Service", () => {
  const prisma = new PrismaClient();
  const testEmail = `authuser_${Date.now()}@example.com`;
  const testPassword = "password123";
  let userId: string;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("should register a new user and return a token", async () => {
    const { user, token } = await authService.register(
      "Auth User",
      testEmail,
      testPassword
    );
    expect(user).toHaveProperty("id");
    expect(user.email).toBe(testEmail);
    expect(token).toBeDefined();
    userId = user.id;
  });

  it("should not register with duplicate email", async () => {
    await expect(
      authService.register("Auth User", testEmail, testPassword)
    ).rejects.toThrow("Email already in use");
  });

  it("should login with correct credentials", async () => {
    const { user, token } = await authService.login(testEmail, testPassword);
    expect(user).toHaveProperty("id");
    expect(user.email).toBe(testEmail);
    expect(token).toBeDefined();
  });

  it("should not login with wrong password", async () => {
    await expect(authService.login(testEmail, "wrongpassword")).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("should not login with non-existent email", async () => {
    await expect(
      authService.login("notfound@example.com", "password")
    ).rejects.toThrow("Invalid credentials");
  });
});
