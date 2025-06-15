"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Button from "@/components/Buttons/Button/Button";

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

        <Button onClick={onGuestContinue} className="guest-button">
          Continuer en mode invité
        </Button>

        <p className="text-sm mt-6 text-gray-500">
          Note : En mode invité, vous ne pourrez pas faire de recherches de
          recettes.
        </p>
      </div>
    </div>
  );
}
