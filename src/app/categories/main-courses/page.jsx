"use server";

import { getRecipesByCategory } from "@/app/actions/getRecipesByCategory";
import Category from "@/components/Category/Category";

export default async function MainCoursesPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const limit = parseInt(params?.limit) || 3;
  const { recipes, totalRecipes } = await getRecipesByCategory(
    "main-courses",
    page,
    limit
  );

  return (
    <Category
      categoryName="Plats principaux"
      categoryKey="main-courses"
      recipes={recipes}
      totalRecipes={totalRecipes}
    />
  );
}
