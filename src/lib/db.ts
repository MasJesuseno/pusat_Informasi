import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "mysql://root@localhost:3306/kmc";
  // Parse mysql://user:password@host:port/database
  const parts = url.replace("mysql://", "").split("@");
  const credentials = parts[0].split(":");
  const hostParts = (parts[1] || parts[0]).split("/");
  const hostPort = hostParts[0].split(":");
  
  const poolConfig = {
    host: hostPort[0] || "localhost",
    user: credentials[0] || "root",
    password: credentials[1] || undefined,
    database: hostParts[1] || "kmc",
    port: hostPort[1] ? parseInt(hostPort[1]) : 3306,
    connectionLimit: 5,
  };
  
  const adapter = new PrismaMariaDb(poolConfig);
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
