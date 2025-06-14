import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MongoClient } from "mongodb";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Affichage du message si l'utilisateur est invité
  if (!user || user.role === "guest") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#ede7dd]">
        <div className="w-full max-w-md bg-white p-6 rounded-lg border border-[#ab833d] text-center">
          <h2 className="text-xl font-bold text-[#ab833d]">Accès restreint</h2>
          <p className="text-red-500 text-sm mt-3">
            Connectez-vous pour accéder à votre profil.
          </p>
          <div className="mt-4">
            <a href="/login/signup" className="add-button">
              Se connecter
            </a>
            <a href="/" className="close-button ml-4">
              Fermer
            </a>
          </div>
        </div>
      </div>
    );
  }

  let userRecipes = [];
  if (user) {
    const client = new MongoClient(process.env.MONGODB_CLIENT);
    await client.connect();
    const db = client.db(process.env.MONGODB_DATABASE);
    userRecipes = await db
      .collection("recipes")
      .find({ author: user.pseudo })
      .toArray();
    await client.close();
  }

  return (
    <div className="profile-container flex flex-col items-center justify-center min-h-screen bg-[#ede7dd]">
      <div className="profile-card w-full max-w-md bg-white p-6 rounded-lg border border-[#ab833d] text-center">
        <h1 className="text-3xl font-bold text-[#ab833d]">Mon Profil</h1>

        {user && (
          <div className="mt-4 space-y-2 text-gray-700">
            <p>
              <span className="font-semibold text-[#ab833d]">Nom :</span>{" "}
              {user.username}
            </p>
            <p>
              <span className="font-semibold text-[#ab833d]">Pseudo :</span>{" "}
              {user.pseudo}
            </p>
            <p>
              <span className="font-semibold text-[#ab833d]">Email :</span>{" "}
              {user.email}
            </p>
            {user.profile && (
              <img
                src={user.profile}
                alt="Photo de profil"
                className="w-48 h-48 rounded-full mx-auto object-cover py-4"
              />
            )}
          </div>
        )}

        {/* Liste des recettes postées */}
        {userRecipes.length > 0 ? (
          <div className="mt-6 text-left">
            <h2 className="text-lg font-bold text-[#7EAF50]">Mes Recettes :</h2>
            <ul className="mt-2 space-y-2">
              {userRecipes.map((recipe) => (
                <li key={recipe._id} className="text-gray-700">
                  <a
                    href={`/categories/${recipe.category}/recipes/${recipe.slug}`}
                    className="hover:underline"
                  >
                    {recipe.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 mt-6 text-lg">
            Aucune recette ajoutée pour l'instant.
          </p>
        )}

        {/* Bouton de retour */}
        <div className="mt-6">
          <Link href="/" className="return-button">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
