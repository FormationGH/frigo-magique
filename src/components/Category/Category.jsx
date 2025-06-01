"use client";

import ReturnButton from "@/components/Buttons/ReturnButton/ReturnButton";
import AddRecipeButton from "@/components/Buttons/AddRecipeButton/AddRecipeButton";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categoryLabels = {
  starters: "Entrées",
  "main-courses": "Plats principaux",
  desserts: "Desserts",
};

export default function CategoryPage({
  categoryName,
  categoryKey,
  recipes,
  totalRecipes,
}) {
  const [page, setPage] = useState(1);
  const limit = 2;
  const router = useRouter();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    router.push(`/categories/${categoryKey}?page=${newPage}&limit=${limit}`);
  };

  return (
    <div className="text-center p-6 mt-10">
      <h1 className="text-3xl font-bold text-[#7EAF50] mb-4">{categoryName}</h1>
      <p className="text-lg text-[#ab833d] mb-6">
        Découvrez les meilleures recettes de {categoryName} !
      </p>

      {/* Bouton Retour*/}
      <ReturnButton label="Retour aux catégories" />
      <AddRecipeButton />

      {/* Affichage des recettes */}
      {recipes?.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <li
              key={recipe._id}
              className="p-4 border rounded-lg bg-white shadow-lg"
            >
              <h3 className="text-xl font-bold text-[#902124]">
                {recipe.title}
              </h3>

              <p className="text-sm text-gray-500">
                Recette postée par :{" "}
                <span className="font-semibold">{recipe.author}</span>
              </p>

              <p className="text-sm text-gray-500">
                Catégorie : {recipe.category} | Portions : {recipe.servings}
              </p>

              <p className="text-sm text-gray-500">
                Temps de préparation : {recipe.prepTime} min | Cuisson :{" "}
                {recipe.cookTime} min
              </p>

              <p className="text-sm text-gray-500">
                Difficulté : {recipe.difficulty}
              </p>

              {/* Bouton détails */}
              <div className="mt-2 flex gap-4">
                <Link href={`/categories/${categoryKey}/recipes/${recipe._id}`}>
                  <button className="add-button">
                    Voir la recette complète
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucune recette disponible.</p>
      )}

      {/* Navigation de pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-[#7EAF50] text-white rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page * limit >= totalRecipes}
          className="px-4 py-2 bg-[#7EAF50] text-white rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
