import { MongoClient } from "mongodb";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Connexion à MongoDB
          const client = await MongoClient.connect(process.env.MONGODB_CLIENT);
          const db = client.db(process.env.MONGODB_DATABASE);

          // Vérifier si l'utilisateur existe
          const user = await db.collection("users").findOne({ email });

          if (!user) {
            await client.close();
            throw new Error("Cet utilisateur n'existe pas");
          }

          // Vérifier le mot de passe avec bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            await client.close();
            throw new Error("Le mot de passe est incorrect");
          }

          // Formater l'utilisateur **sans le mot de passe**
          const formattedUser = {
            _id: user._id.toString(),
            username: user.username,
            pseudo: user.pseudo,
            email: user.email,
            profile: user.profile,
          };

          await client.close();
          return formattedUser;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;

      // Connexion à MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_CLIENT);
      console.log("Connexion MongoDB:", process.env.MONGODB_CLIENT);

      const db = client.db(process.env.MONGODB_DATABASE);

      // Récupérer l'utilisateur
      const userDB = await db
        .collection("users")
        .findOne({ email: session.user.email });

      await client.close();

      return {
        ...session,
        user: {
          _id: userDB._id.toString(),
          username: userDB.username,
          pseudo: userDB.pseudo,
          email: userDB.email,
          profile: userDB.profile,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
