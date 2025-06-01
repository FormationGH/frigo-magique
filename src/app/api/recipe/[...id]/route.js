"use server";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(req) {
  const urlParts = req.nextUrl.pathname.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ error: "ID invalide", receivedId: id }),
      { status: 400 }
    );
  }

  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(id) });

    if (!recipe) {
      return new Response(JSON.stringify({ error: "Recette non trouvée" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(recipe), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
