"use server";

import { MongoClient } from "mongodb";

export async function getRecipesByCategory(category) {
  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const recipes = await db.collection("recipes").find({ category }).toArray();

    recipes.forEach((recipe) => {
      // Supprime les doublons
      recipe.ingredients = [...new Set(recipe.ingredients)];
      recipe.steps = [
        ...new Set(recipe.steps.flatMap((item) => item.split("|"))),
      ];
    });

    return recipes;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des recettes : " + error.message
    );
  } finally {
    await client.close();
  }
}
