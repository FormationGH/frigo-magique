"use server";

import { MongoClient } from "mongodb";

export async function getRecipesByCategory(category, page = 1, limit = 2) {
  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const skip = (page - 1) * limit;

    const recipes = await db
      .collection("recipes")
      .find(category ? { category } : {})
      .skip(skip) // Ajoute la pagination
      .limit(limit) // Limite à 2 recettes
      .toArray();

    const totalRecipes = await db
      .collection("recipes")
      .countDocuments(category ? { category } : {});

    recipes.forEach((recipe) => {
      recipe._id = recipe._id.toString();
      // Supprime les doublons
      recipe.ingredients = [...new Set(recipe.ingredients)];
      recipe.steps = [
        ...new Set(recipe.steps.flatMap((item) => item.split("|"))),
      ];
    });
    return { recipes, totalRecipes };
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes :", error);
    return { recipes: [], totalRecipes: 0 };
  } finally {
    await client.close();
  }
}
