"use client";

import { createUser } from "@/app/actions/create-users";
import Button from "@/components/Button/Button";
import { checkEmail } from "@/utils/check-emailsyntax";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Signup() {
  const router = useRouter();

  async function prepareCreateUser(formData) {
    console.log(
      "Données reçues :",
      formData.get("username"),
      formData.get("pseudo"),
      formData.get("email"),
      formData.get("password")
    );
    const username = formData.get("username");
    const pseudo = formData.get("pseudo");
    const email = formData.get("email");
    const password = formData.get("password");

    // Vérification des champs
    if (!username || !pseudo || !email || !password) {
      throw new Error("Aucun champ ne doit être vidé !");
    }

    if (!checkEmail(email)) {
      throw new Error("Veuillez entrer un email valide !");
    }

    try {
      await createUser(formData);

      toast.success("Votre compte a bien été créé avec succès !");
      router.push("/login/signin");
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    const formData = new FormData(event.target);
    prepareCreateUser(formData);
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="form-container mt-20">
        {/* Formulaire d'inscription */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <h2 className=" title text-2xl font-bold mb-4">Créer un compte</h2>

            {/* Champ Nom d'utilisateur */}
            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="form-input"
                placeholder="Votre nom complet"
              />
            </div>

            {/* Champ Pseudo */}
            <div className="mb-4">
              <label htmlFor="pseudo" className="form-label ">
                Pseudo
              </label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                required
                className="form-input"
                placeholder="Votre pseudo"
              />
            </div>

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
                name="password"
                required
                className="form-input"
                placeholder="Votre mot de passe"
              />
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              className="w-full bg-[#7EAF50] text-white p-2 rounded-md shadow-md hover:bg-[#89AF66]"
            >
              S'inscrire
            </button>
          </form>
        </div>

        {/* Bouton "Se connecter" */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Déjà enregistré ?{" "}
            <Link href="/login/signin">
              <span className="text-[#7EAF50] font-medium hover:underline">
                Se connecter
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
