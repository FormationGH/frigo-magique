"use server";

import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function createRecipe(formData) {
  const session = await getServerSession(authOptions);
  const pseudo = session?.user?.pseudo ?? "Erreur récupération pseudo";

  // Récupération des champs depuis le formulaire
  const recipeData = {
    title: formData.get("title"),
    ingredients: formData.get("ingredients")?.split("|") || [],
    steps: formData.get("steps")?.split("|") || [],
    category: formData.get("category"),
    servings: parseInt(formData.get("servings")),
    prepTime: parseInt(formData.get("prepTime")),
    cookTime: parseInt(formData.get("cookTime")),
    difficulty: formData.get("difficulty"),
    author: pseudo,
    creationDate: new Date(),
  };

  // Vérification des champs obligatoires
  if (Object.values(recipeData).some((value) => !value || value === "")) {
    throw new Error("Tous les champs sont obligatoires !");
  }

  if (!["starters", "main-courses", "desserts"].includes(recipeData.category)) {
    throw new Error("La catégorie doit être valide !");
  }

  const client = new MongoClient(process.env.MONGODB_CLIENT);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DATABASE);

    const result = await db.collection("recipes").insertOne(recipeData);

    if (!result.insertedId) {
      throw new Error("L'insertion de la recette a échoué !");
    }

    return {
      success: true,
      message: "Recette ajoutée avec succès !",
      id: result.insertedId.toString(),
    };
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await client.close();
  }
}
