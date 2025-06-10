import { MongoClient } from "mongodb";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import errorMessages from "@/utils/error";

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
            throw new Error(errorMessages.userNotFound);
          }

          // Vérifier le mot de passe avec bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            await client.close();
            throw new Error(errorMessages.incorrectPassword);
          }

          // Formater l'utilisateur sans le mot de passe
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
          throw new Error(errorMessages.serverError);
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
      if (user) {
        token.user = {
          _id: user._id.toString(),
          username: user.username,
          pseudo: user.pseudo || "Pseudo manquant",
          email: user.email,
          profile: user.profile,
        };
      } else if (!token.user.pseudo) {
        token.user.pseudo = "Pseudo manquant";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        _id: token.user._id,
        username: token.user.username,
        pseudo: token.user.pseudo ?? "Pseudo non récupéré",
        email: token.user.email,
        profile: token.user.profile,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
