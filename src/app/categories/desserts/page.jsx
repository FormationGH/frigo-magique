"use server";

import { getRecipesByCategory } from "@/app/actions/getRecipesByCategory";
import Category from "@/components/Category/Category";

export default async function DessertsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const limit = parseInt(params?.limit) || 3;
  const { recipes, totalRecipes } = await getRecipesByCategory(
    "desserts",
    page,
    limit
  );

  return (
    <Category
      categoryName="Desserts"
      categoryKey="desserts"
      recipes={recipes}
      totalRecipes={totalRecipes}
    />
  );
}
