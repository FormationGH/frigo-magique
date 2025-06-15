import { MongoClient } from "mongodb";

// Fonction pour convertir les mots au singulier
function toSingular(word) {
  return word.endsWith("s") ? word.slice(0, -1) : word;
}

export async function GET(req) {
  const url = new URL(req.url);
  const ingredientQuery = url.searchParams.get("ingredients");
  const recipeQuery = url.searchParams.get("recipe");

  const client = await MongoClient.connect(process.env.MONGODB_CLIENT);
  const db = client.db(process.env.MONGODB_DATABASE);

  let recipes = [];

  if (recipeQuery) {
    // Recherche par nom de recette
    recipes = await db
      .collection("recipes")
      .find({ title: { $regex: `${recipeQuery}`, $options: "i" } })
      .toArray();
  } else if (ingredientQuery) {
    const ingredients = ingredientQuery
      .split(",")
      .map((i) => toSingular(i.toLowerCase()));

    recipes = await db
      .collection("recipes")
      .find({
        ingredients: { $in: ingredients.map((i) => new RegExp(`${i}`, "i")) },
      })
      .toArray();
  }

  await client.close();
  return Response.json(recipes, { status: 200 });
}
