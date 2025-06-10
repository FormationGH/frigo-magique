"use server";
import { MongoClient, ObjectId } from "mongodb";

import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  const urlParts = req.nextUrl.pathname.split("/");
  const slug = urlParts[urlParts.length - 1];

  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const recipe = await db.collection("recipes").findOne({ slug: slug });

    if (!recipe) {
      return new Response(
        JSON.stringify({ error: errorMessages.recipeNotFound }),
        {
          status: 404,
        }
      );
    }
    return new Response(JSON.stringify(recipe), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: errorMessages.serverError }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}

export async function DELETE(req) {
  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const recipeId = urlParts[urlParts.length - 1];

    if (!ObjectId.isValid(recipeId)) {
      return new Response(JSON.stringify({ error: "ID invalide" }), {
        status: 400,
      });
    }

    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(recipeId) });

    if (!recipe) {
      return new Response(JSON.stringify({ error: "Recette introuvable" }), {
        status: 404,
      });
    }
    // Supprimer l’image sur Cloudinary
    if (recipe.image) {
      const publicId = recipe.image.split("/").pop().split(".")[0]; // Extraire le `public_id`
      await cloudinary.v2.uploader.destroy(publicId);
    }

    // Supprimer la recette
    await db.collection("recipes").deleteOne({ _id: new ObjectId(recipeId) });

    return new Response(
      JSON.stringify({ message: "Recette supprimée avec succès !" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
