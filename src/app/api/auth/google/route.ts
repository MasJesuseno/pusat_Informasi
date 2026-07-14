import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: "Google OAuth is not configured" },
        { status: 500 }
      );
    }

    const { credential } = await request.json();
    if (!credential) {
      return NextResponse.json(
        { error: "Credential is required" },
        { status: 400 }
      );
    }

    // Verify Google ID token
    const googleClient = new OAuth2Client(clientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Invalid Google credential" },
        { status: 401 }
      );
    }

    const email = payload.email;

    // Restrict to specific domain only
    const allowedDomain = "@dompetdhuafa.org";
    if (!email.endsWith(allowedDomain)) {
      return NextResponse.json(
        { error: `Only ${allowedDomain} email addresses are allowed to sign in with Google` },
        { status: 403 }
      );
    }

    const name = payload.name || email.split("@")[0];
    const image = payload.picture || null;
    const googleId = payload.sub;
    const emailVerified = payload.email_verified ? new Date() : null;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Auto-create new user with INTERNAL role
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: "INTERNAL",
          googleId,
          image,
          emailVerified,
        },
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          image: image || user.image,
          emailVerified: emailVerified || user.emailVerified,
        },
      });
    }

    // Generate our custom JWT (same as email/password login)
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as "ADMIN" | "HR" | "INTERNAL",
      name: user.name,
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    const isSecure = request.headers.get("x-forwarded-proto") === "https" ||
      request.url.startsWith("https");

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
