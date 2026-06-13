import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/enter/dashboard",
  "/enter/articles",
  "/enter/groups",
  "/enter/subgroups",
  "/enter/settings",
  "/enter/users",
  "/enter/hr",
  "/enter/question-groups",
  "/enter/questions",
  "/enter/exams",
  "/enter/exam-assignments",
  "/enter/my-exams",
];

const adminPaths = [
  "/enter/settings",
  "/enter/users",
];

const managerPaths = [
  "/enter/groups",
  "/enter/subgroups",
  "/enter/articles/new",
  "/enter/question-groups",
  "/enter/questions",
  "/enter/exams",
  "/enter/exam-assignments",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/enter") {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])) as { role: string };
        if (payload.role === "HR") {
          return NextResponse.redirect(new URL("/enter/hr/dashboard", request.url));
        }
      } catch {}
      return NextResponse.redirect(new URL("/enter/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/enter/login", request.url));
  }

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/enter/login", request.url));
  }

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as { role: string };
      
      // Admin-only paths: Settings, Users
      const isAdminPath = adminPaths.some(p => pathname.startsWith(p));
      if (isAdminPath && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/enter/dashboard", request.url));
      }

      // Manager paths: Groups, Sub Groups, New Article - allowed for ADMIN and HR
      const isManagerPath = managerPaths.some(p => pathname.startsWith(p));
      if (isManagerPath && payload.role === "INTERNAL") {
        return NextResponse.redirect(new URL("/enter/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/enter/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/enter/:path*"],
};
