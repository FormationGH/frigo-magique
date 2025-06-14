"use server";

import { MongoClient } from "mongodb";
import errorMessages from "@/utils/error";

export async function getRecipesByCategory(category, page = 1, limit = 3) {
  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const skip = (page - 1) * limit;

    const recipes = await db
      .collection("recipes")
      .find(category ? { category } : {})
      .skip(skip) // Ajoute la pagination
      .limit(limit) // Limite au nombre de recettes à afficher
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
    return { recipes: [], totalRecipes: 0, error: errorMessages.fetchError };
  } finally {
    await client.close();
  }
}
