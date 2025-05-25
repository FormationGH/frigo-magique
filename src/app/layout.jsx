import "./globals.css";
import { AuthProvider } from "./Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConnectedLayout from "@/components/ConnectedLayout/ConnectedLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata = {
  title: "Frigo Magique",
  description:
    "Trouvez une recette rapidement en fonction de vos ingrédients :)",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions); // Récupérer la session côté serveur
  return (
    <html lang="fr">
      <body className="bg-gray flex flex-col min-h-screen">
        <ToastContainer position="bottom-right" />

        {/* Contenu principal */}
        <div className="flex-1 flex items-center justify-center">
          <AuthProvider>
            <ConnectedLayout session={session}>{children}</ConnectedLayout>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
