export async function GET(req) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  const client = new MongoClient(process.env.MONGODB_CLIENT);
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    const recipes = await db
      .collection("recipes")
      .find(category ? { category } : {})
      .toArray();
    return new Response(JSON.stringify(recipes), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  } finally {
    await client.close();
  }
}
