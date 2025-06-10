"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import errorMessages from "@/utils/error";
import Spinner from "@/components/Spinner/Spinner";
import RecipeContent from "@/components/RecipeContent/RecipeContent";

export default function StarterRecipePage() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipe/${slug}`);
        if (!response.ok) {
          throw new Error(errorMessages.serverError);
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchRecipe();
    }
  }, [slug]);

  if (loading) {
    return <Spinner />;
  }

  if (!recipe)
    return (
      <p className="text-red-500 flex flex-col justify-center items-center h-screen">
        {errorMessages.recipeNotFound}
      </p>
    );

  return <RecipeContent recipe={recipe} categoryPath="main-courses" />;
}
