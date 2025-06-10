"use client";

import { checkEmail } from "@/utils/check-emailsyntax";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import errorMessages from "@/utils/error";
import Button from "@/components/Buttons/Button/Button";

export default function Signin() {
  const router = useRouter();

  // Fonction pour préparer la connexion
  const prepareLogin = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    // Vérification des champs
    if (!email || !password) {
      return toast.error(errorMessages.missingFields);
    }

    // Vérification de l'email
    if (!checkEmail(email)) {
      return toast.error(errorMessages.invalidEmail);
    }

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (response.error) {
        return toast.error(errorMessages.loginFailed);
      }

      toast.success("Connexion réussie !");
      router.replace("/"); // Redirection après connexion
    } catch (error) {
      toast.error(errorMessages.serverError);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    prepareLogin(formData);
    event.target.reset();
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="form-container">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4">Connexion</h2>

          {/* Champ Email */}
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="form-input"
              placeholder="exemple@domaine.com"
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password" // Important pour formData
              required
              className="form-input"
              placeholder="Votre mot de passe"
            />
          </div>

          {/* Bouton Soumettre */}
          <Button
            type="submit"
            className="w-full bg-[#7EAF50] text-white p-2 rounded-md shadow-md hover:bg-[#89AF66]"
          >
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  );
}
