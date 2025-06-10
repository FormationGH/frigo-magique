import Button from "@/components/Buttons/Button/Button";
import { useSession } from "next-auth/react";
import DeleteRecipeButton from "@/components/Buttons/DeleteRecipeButton/DeleteRecipeButton";
import { useState } from "react";

export default function RecipeContent({ recipe, categoryPath }) {
  const { data: session } = useSession();
  const [isDeleted, setIsDeleted] = useState(false);
  // const [recipes, setRecipes] = useState([recipe]);

  const handleDelete = async (recipeId) => {
    setIsDeleted(true); // Cache la recette immédiatement après suppression
  };
  return (
    <div className="container mx-auto text-center p-4 md:p-6 max-w-sm md:max-w-lg lg:max-w-2xl">
      {!isDeleted ? ( // Vérifie si la recette est supprimée
        <>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#902124] mb-4">
            {recipe.title}
          </h1>

          <p className="text-sm md:text-lg text-[#ab833d]">
            <strong>Auteur :</strong> {recipe.author || "Auteur inconnu"}
          </p>

          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
            />
          ) : (
            <p className="text-red-500">Aucune image disponible.</p>
          )}

          <p className="text-sm md:text-lg text-gray-500 mt-4 md:mt-6 font-semibold">
            Pour {recipe.servings} personnes
          </p>

          <p className="text-sm md:text-lg text-gray-500 font-semibold mt-2 md:mt-4">
            Temps de préparation : {recipe.prepTime} min | Cuisson :{" "}
            {recipe.cookTime} min
          </p>

          <p className="text-sm md:text-lg text-gray-500 mt-2 md:mt-4">
            <span className="font-semibold">Difficulté :</span>{" "}
            {recipe.difficulty}
          </p>

          <h4 className="font-semibold text-gray-500 mt-4 md:mt-6 text-sm md:text-lg">
            Ingrédients :
          </h4>
          <ul className="list-none mx-auto max-w-md md:max-w-lg lg:max-w-2xl text-sm md:text-lg text-gray-500">
            {recipe.ingredients?.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.replace(/\|/g, ", ")}</li>
              ))
            ) : (
              <p className="text-gray-500">Aucun ingrédient renseigné.</p>
            )}
          </ul>

          <h4 className="font-semibold text-gray-500 mt-4 md:mt-6 text-sm md:text-lg">
            Etapes :
          </h4>
          <ol className="mx-auto max-w-md md:max-w-lg text-sm md:text-lg text-gray-500 space-y-2">
            {recipe.steps?.length > 0 ? (
              recipe.steps.map((step, index) => (
                <li key={index} className="text-left">
                  <span className="inline-block -ml-10 font-semibold">
                    Étape {index + 1}:
                  </span>{" "}
                  {step.trim()}
                </li>
              ))
            ) : (
              <p className="text-gray-500">Aucune étape disponible.</p>
            )}
          </ol>

          <Button
            className="add-button mt-4 md:mt-6 mr-5"
            onClick={() =>
              (window.location.href = `/categories/${categoryPath}`)
            }
          >
            Retour aux{" "}
            {categoryPath === "starters"
              ? "entrées"
              : categoryPath === "main-courses"
              ? "plats principaux"
              : "desserts"}
          </Button>

          {/* Affichage sécurisé du bouton de suppression */}
          {session &&
            session.user &&
            recipe.authorEmail &&
            (session.user.email === recipe.authorEmail ||
              session.user.isAdmin) && (
              <DeleteRecipeButton
                recipeId={recipe._id}
                onDelete={handleDelete}
              />
            )}
        </>
      ) : (
        <p className="text-gray-500 text-lg font-semibold mt-4 md:mt-6">
          Recette supprimée !
        </p>
      )}
    </div>
  );
}
