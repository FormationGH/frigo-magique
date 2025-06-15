import "./globals.css";
import { AuthProvider } from "./Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConnectedLayout from "@/components/ConnectedLayout/ConnectedLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ThemeProvider } from "@/app/Provider";
import ThemeWrapper from "@/components/ThemeWrapper/ThemeWrapper";

export const metadata = {
  title: "Frigo Magique",
  description:
    "Trouvez une recette rapidement en fonction de vos ingrédients :)",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions); // Récupère la session côté serveur
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Trouvez une recette rapidement en fonction de vos ingrédients et évitez le gaspillage alimentaire !"
        />
        <link rel="icon" href="/icon.png" type="image/png" />

        {/* Socials Cards */}
        <meta
          property="og:title"
          content="Frigo Magique - Cuisine anti-gaspillage"
        />
        <meta
          property="og:description"
          content="Transformez vos ingrédients en recettes délicieuses et évitez le gaspillage alimentaire !"
        />
        <meta
          property="og:image"
          content="https://www.frigomagique.com/og-image.jpg"
        />
        <meta property="og:url" content="https://www.frigomagique.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Frigo Magique - Cuisine anti-gaspillage"
        />
        <meta
          name="twitter:description"
          content="Transformez vos ingrédients en recettes délicieuses et évitez le gaspillage alimentaire !"
        />
        <meta
          name="twitter:image"
          content="https://www.frigomagique.com/twitter-image.jpg"
        />
        <meta name="twitter:url" content="https://www.frigomagique.com" />
      </head>
      <body className="bg-gray flex flex-col min-h-screen">
        <ToastContainer position="bottom-right" />

        {/* Contenu principal */}
        <div className="flex-1 flex items-center justify-center">
          <AuthProvider>
            <ThemeProvider>
              <ThemeWrapper>
                <ConnectedLayout session={session}>{children}</ConnectedLayout>
              </ThemeWrapper>
            </ThemeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
