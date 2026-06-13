import { NextResponse } from "next/server";
import { getAllSettings, updateSetting, defaultSettings } from "@/lib/settings";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  const settings = await getAllSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      if (key in defaultSettings && typeof value === "string") {
        await updateSetting(key, value);
      }
    }
    const settings = await getAllSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("PUT /api/settings error:", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads dir exists
    await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });

    const ext = file.name.split(".").pop() || "png";
    const filename = `${Date.now()}.${ext}`;
    const filepath = join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
