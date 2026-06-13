import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export interface JWTPayload {
  userId: number;
  email: string;
  role: "ADMIN" | "HR" | "INTERNAL";
  name: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "kmc-secret-key";
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// For server components and API routes
export function getTokenFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/\btoken=([^;]+)/);
  return match ? match[1] : null;
}
