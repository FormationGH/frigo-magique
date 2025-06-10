"use server";

import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "") // Supprime les caractères spéciaux
    .replace(/\s+/g, "-"); // Remplace les espaces par des tirets
}

export async function createRecipe(formData) {
  const session = await getServerSession(authOptions);
  const pseudo = session?.user?.pseudo ?? "Erreur récupération pseudo";
  const slug = generateSlug(formData.get("title")); // Génère le slug basé sur le titre

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
    author: session.user.pseudo,
    authorEmail: session?.user?.email,
    creationDate: new Date(),
    image: formData.get("image") || "",
    slug: slug, //Pour remplacer l'id par le titre dans l'url
  };

  // Vérification des champs obligatoires
  if (Object.values(recipeData).some((value) => !value || value === "")) {
    throw new Error(errorMessages.missingFields);
  }

  if (!["starters", "main-courses", "desserts"].includes(recipeData.category)) {
    throw new Error(errorMessages.invalidCategory);
  }

  const client = new MongoClient(process.env.MONGODB_CLIENT);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DATABASE);

    const result = await db.collection("recipes").insertOne(recipeData);

    if (!result.insertedId) {
      throw new Error(errorMessages.insertError);
    }

    return {
      success: true,
      message: "Recette ajoutée avec succès !",
      slug: recipeData.slug,
    };
  } catch (error) {
    throw new Error(errorMessages.generalServerError);
  } finally {
    await client.close();
  }
}
