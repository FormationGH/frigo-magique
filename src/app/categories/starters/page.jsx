"use server";

import { getRecipesByCategory } from "@/app/actions/getRecipesByCategory";
import Category from "@/components/Category/Category";

export default async function StartersPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const limit = parseInt(params?.limit) || 2;
  const { recipes, totalRecipes } = await getRecipesByCategory(
    "starters",
    page,
    limit
  );

  if (!recipes) {
    return <p>Erreur : Impossible de récupérer les recettes.</p>;
  }

  return (
    <Category
      categoryName="Entrées"
      categoryKey="starters"
      recipes={recipes}
      totalRecipes={totalRecipes}
    />
  );
}
