"use server";

import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { checkEmail } from "@/utils/check-emailsyntax";
import errorMessages from "@/utils/error";

export async function createUser(formData) {
  const username = formData.get("username");
  const pseudo = formData.get("pseudo");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!username || !pseudo || !email || !password) {
    throw new Error(errorMessages.missingFields);
  }

  if (!checkEmail(email)) {
    throw new Error(errorMessages.invalidEmail);
  }

  const client = await MongoClient.connect(process.env.MONGODB_CLIENT);
  const db = client.db(process.env.MONGODB_DATABASE);

  try {
    // Vérifier si l'email est déjà utilisé
    let user = await db.collection("users").find({ email }).limit(1).toArray();
    if (user.length !== 0) {
      await client.close();
      throw new Error(errorMessages.emailExists);
    }

    // Vérifier si le pseudo est déjà utilisé
    user = await db.collection("users").find({ pseudo }).limit(1).toArray();
    if (user.length !== 0) {
      await client.close();
      throw new Error(errorMessages.generalServerError);
    }

    // Hacher le mot de passe
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Ajouter l'utilisateur
    await db.collection("users").insertOne({
      username,
      pseudo,
      email,
      password: encryptedPassword,
      profile: "/profile.png",
      url: "",
      creation: new Date(),
    });

    await client.close();
    return { success: true, message: "Utilisateur créé avec succès !" };
  } catch (error) {
    await client.close();
    throw new Error(error.message);
  }
}
