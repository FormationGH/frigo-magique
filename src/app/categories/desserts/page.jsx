"use server";

import { getRecipesByCategory } from "@/app/actions/getRecipesByCategory";

export default async function DessertsPage() {
  const recipes = await getRecipesByCategory("dessert"); // Récupère les desserts

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold text-[#7EAF50] mb-4">
        Recettes de desserts
      </h1>
      <p className="text-lg text-[#ab833d] mb-6">
        Découvrez les meilleurs desserts avec vos ingrédients !
      </p>

      {recipes.length > 0 ? (
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
                Catégorie : {recipe.category} | Portions : {recipe.servings}
              </p>

              <p className="text-sm text-gray-500">
                Temps de préparation : {recipe.prepTime} min | Cuisson :{" "}
                {recipe.cookTime} min
              </p>

              <p className="text-sm text-gray-500">
                Difficulté : {recipe.difficulty}
              </p>

              <p className="text-sm text-gray-500">
                Date de création :{" "}
                {new Date(recipe.creationDate).toLocaleDateString()}
              </p>

              <h4 className="font-semibold text-gray-700 mt-2">
                Ingrédients :
              </h4>
              <ul className="list-none ml-5 text-sm text-gray-600">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.replace(/\|/g, ", ")}</li> // Remplace `|` par des virgules
                ))}
              </ul>

              <h4 className="font-semibold text-gray-700 mt-2">Étapes :</h4>
              <ol className="list-none text-left ml-5 text-sm text-gray-500">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucune recette de dessert enregistrée.</p>
      )}
    </div>
  );
}
