"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const onSelectMode = (mode) => {
    setCookie("accessMode", mode, { maxAge: 60 * 60 * 24 * 7 }); // Stocke le choix pour 7 jours
    router.push("/categories"); // Redirige vers les recettes
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="auth-container">
        <h2 className="title">Choisissez votre mode d’accès :</h2>

        <div className="flex flex-col gap-4">
          {/* Connexion */}
          <Link href="/login/signup">
            <div
              className="auth-method auth-method-green max-w-md space-y-6"
              onClick={() => onSelectMode("user")}
            >
              <h3 className="font-bold text-xl">S'inscrire ou se connecter</h3>
              <p className="text-sm mt-2">
                Accédez aux fonctionnalités complètes : sauvegardez vos recettes
                et profitez du système de recherche !
              </p>
            </div>
          </Link>

          {/* Mode Invité */}
          <Link href="/login/pass">
            <div
              className="auth-method auth-method-brown max-w-md space-y-6"
              onClick={() => onSelectMode("guest")}
            >
              <h3 className="font-bold text-xl"> Utiliser en mode invité</h3>
              <p className="text-sm mt-2">
                Explorez Frigo Magique sans compte : découvrez des recettes sans
                autres fonctionnalités.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
