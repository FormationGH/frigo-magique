"use server";

import { MongoClient } from "mongodb";

export async function createRecipe(formData) {
  const title = formData.get("title");
  const ingredients = formData.get("ingredients")?.split("|") || [];
  const steps = formData.get("steps")?.split("|") || [];
  const category = formData.get("category");
  const servings = formData.get("servings");
  const prepTime = formData.get("prepTime");
  const cookTime = formData.get("cookTime");
  const difficulty = formData.get("difficulty");

  // Vérification des champs
  if (
    !title ||
    !ingredients.length ||
    !steps.length ||
    !category ||
    !servings ||
    !prepTime ||
    !cookTime ||
    !difficulty
  ) {
    throw new Error("Tous les champs sont obligatoires !");
  }

  if (!["entrée", "plat", "dessert"].includes(category)) {
    throw new Error("La catégorie doit être valide !");
  }

  const client = new MongoClient(process.env.MONGODB_CLIENT);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DATABASE);

    await db.collection("recipes").insertOne({
      title,
      ingredients,
      steps,
      category,
      servings: parseInt(servings),
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      difficulty,
      creationDate: new Date(),
    });

    return { success: true, message: "Recette ajoutée avec succès !" };
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await client.close();
  }
}
