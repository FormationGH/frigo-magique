"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import error from "@/utils/error";
import Spinner from "@/components/Spinner/Spinner";
import RecipeContent from "@/components/RecipeContent/RecipeContent";

export default function StarterRecipePage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipe/${id}`);
        if (!response.ok) {
          throw new Error(error.fetchError);
        }
        const data = await response.json();
        setRecipe(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement de la recette :", error);
        setRecipe(null);
        setLoading(false);
      }
    }

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!recipe) return <p className="text-red-500">{error.recipeNotFound}</p>;

  return <RecipeContent recipe={recipe} categoryPath="main-courses" />;
}
