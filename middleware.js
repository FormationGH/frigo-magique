import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function middleware(request) {
  // Vérifier la session côté serveur avec NextAuth
  const session = await getServerSession(authOptions);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ingredients", "/recipes", "/categories/:path*"], // Routes protégées
};
