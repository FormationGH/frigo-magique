import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("Middleware exécuté sur :", request.nextUrl.pathname);
  let isAuthenticated = false;

  // Vérifie si l'utilisateur est invité
  if (request.cookies.get("guest")) {
    isAuthenticated = true;
  }

  // Vérifie si l'utilisateur est connecté via NextAuth
  if (request.cookies.get("__Secure-next-auth.session-token")) {
    isAuthenticated = true;
  }

  // Redirige si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ingredients", "/recipes", "/categories", "/categories/:path*"], // Ajout de routes spécifiques
};
