import { MongoClient } from "mongodb";
import errorMessages from "@/utils/error";

export async function GET(req) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const page = parseInt(url.searchParams.get("page")) || 1;
  const limit = parseInt(url.searchParams.get("limit")) || 2;
  const skip = (page - 1) * limit;

  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const recipes = await db
      .collection("recipes")
      .find(category ? { category } : {})
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalRecipes = await db
      .collection("recipes")
      .countDocuments(category ? { category } : {});
    return new Response(JSON.stringify({ recipes, totalRecipes }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: errorMessages.serverError }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
