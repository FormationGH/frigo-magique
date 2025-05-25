"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function GuestMode() {
  const router = useRouter();

  const onGuestContinue = () => {
    setCookie("guest", "true"); // Définit le cookie "guest"
    router.push("/"); // Redirige vers l'accueil
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="form-container">
        <h2 className="title">Bienvenue en mode invité</h2>
        <p className="guest-description p-10">
          Vous explorez Frigo Magique sans créer de profil. Accédez aux recettes
          disponibles !
        </p>

        <button onClick={onGuestContinue} className="guest-button">
          Continuer en mode invité
        </button>

        <p className="text-sm mt-6 text-gray-500">
          Note : En mode invité, vous ne pourrez pas sauvegarder vos ingrédients
          ni interagir avec les recettes.
        </p>
      </div>
    </div>
  );
}
