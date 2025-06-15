"use client";

import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {/* Titre principal */}
      <div className="max-w-4xl mx-auto text-center p-6">
        <h1 className="text-3xl font-bold text-[#ab833d] mb-10">
          Bienvenue sur Frigo Magique !
        </h1>
        <div className="text-lg mt-4 text-gray-700 dark:text-white">
          <p>
            Chaque jour, des aliments sont oubliés et finissent à la poubelle,
            alors qu’ils pourraient devenir de délicieux plats faits maison.
            Chez <strong>Frigo Magique</strong>, nous croyons que chaque
            ingrédient mérite d’être valorisé.
          </p>
          <p>
            Plutôt que de gaspiller, découvrez comment donner une nouvelle vie
            aux restes et aux produits du quotidien grâce à des recettes
            créatives et faciles à réaliser. Il suffit d’entrer les ingrédients
            dont vous disposez, et <strong>Frigo Magique</strong> vous aidera à
            trouver des idées de plats savoureux !
          </p>
          <p>
            Moins de gaspillage, plus de créativité : chaque repas devient un
            geste éco-responsable.
          </p>
          <p>
            Rejoignez le mouvement et faites de votre cuisine un espace
            innovant, durable et magique !
          </p>
        </div>
      </div>

      <p className="text-lg text-[#ab833d] max-w-lg mb-6">
        Choisissez une catégorie pour explorer les recettes :
      </p>

      {/* Choix des catégories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        {/* Entrées */}
        <Link href="/categories/starters">
          <div className="p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition">
            <Image
              src="/starters.jpg"
              alt="Entrées"
              width={400}
              height={250}
              className="rounded-lg shadow-md object-cover aspect-[16/10]"
            />
            <h2 className="text-2xl font-bold text-[#7EAF50] mt-4 border-b-2 border-gray-300 hover:text-[#5C8F3E] transition duration-300">
              Entrées
            </h2>
          </div>
        </Link>

        {/* Plats */}
        <Link href="/categories/main-courses">
          <div className="p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition">
            <Image
              src="/plats.jpg"
              alt="Plats"
              width={400}
              height={250}
              className="rounded-lg shadow-md object-cover aspect-[16/10]"
            />
            <h2 className="text-2xl font-bold text-[#7EAF50] mt-4 border-b-2 border-gray-300 hover:text-[#5C8F3E] transition duration-300">
              Plats
            </h2>
          </div>
        </Link>

        {/* Desserts */}
        <Link href="/categories/desserts">
          <div className="p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition">
            <Image
              src="/desserts.jpg"
              alt="desserts"
              width={400}
              height={250}
              className="rounded-lg shadow-md object-cover aspect-[16/10]"
            />
            <h2 className="text-2xl font-bold text-[#7EAF50] mt-4 border-b-2 border-gray-300 hover:text-[#5C8F3E] transition duration-300">
              Desserts
            </h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
