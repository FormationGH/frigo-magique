"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchModal({ closeModal }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState(null);

  const [searchType, setSearchType] = useState("ingredients");
  const router = useRouter();

  // Vérifier si l’utilisateur est connecté au chargement
  useEffect(() => {
    fetch(`/api/auth/session`)
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, []);

  const handleSearch = async () => {
    if (!session || !session.user) {
      setErrorMessage("Connectez-vous pour utiliser la recherche.");
      return;
    }

    if (!search.trim()) return;
    setHasSearched(true);

    const queryParam =
      searchType === "recipe"
        ? `recipe=${search}`
        : `ingredients=${search.toLowerCase().trim()}`;
    const res = await fetch(`/api/search-recipes?${queryParam}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Erreur API:", res.statusText);
      return;
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      setResults([]);
      setErrorMessage(
        `Aucune recette trouvée avec "${search}". Essayez un autre terme !`
      );
      return;
    }

    setErrorMessage("");
    setResults(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-[#ab833d]">
          Rechercher des recettes
        </h2>

        {/* Si l'utilisateur est invité, afficher un message + bouton de connexion */}
        {!session || !session.user ? (
          <div className="text-center mt-4">
            <p className="text-red-500 text-sm mb-3">
              Connectez-vous pour utiliser la recherche.
            </p>
            <button
              onClick={() => {
                router.push("/login/signup"); // Redirige vers la page de connexion
                closeModal(); // Ferme la fenêtre après le clic
              }}
              className="add-button mr-5"
            >
              Se connecter
            </button>

            <button onClick={closeModal} className="close-button">
              Fermer
            </button>
          </div>
        ) : (
          <>
            {/* Sélecteur de type de recherche */}
            <div className="flex justify-center gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="searchType"
                  value="ingredients"
                  checked={searchType === "ingredients"}
                  onChange={() => setSearchType("ingredients")}
                />
                Par ingrédient
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="searchType"
                  value="recipe"
                  checked={searchType === "recipe"}
                  onChange={() => setSearchType("recipe")}
                />
                Par nom de recette
              </label>
            </div>

            <input
              type="text"
              placeholder={
                searchType === "recipe"
                  ? "Ex : Pot-au-feu"
                  : "Ex : tomates, fromage"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded p-2 w-full mt-4"
            />

            <button onClick={handleSearch} className="guest-button mt-4 mr-5">
              Rechercher
            </button>

            {/* Affichage des résultats */}
            {results.length > 0 && (
              <div className="mt-4 text-left">
                <h2 className="text-lg font-bold text-[#7EAF50]">
                  Recettes trouvées :
                </h2>
                <ul className="mt-2 space-y-2">
                  {results.map((recipe) => (
                    <li key={recipe._id}>
                      <a
                        href={`/categories/${recipe.category}/recipes/${recipe._id}`}
                        className="hover:underline"
                      >
                        {recipe.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasSearched && errorMessage && (
              <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
