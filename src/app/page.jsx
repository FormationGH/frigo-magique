"use client";

import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {/* Titre principal */}
      <h1 className="text-3xl font-extrabold text-[#7EAF50] mb-4">
        Bienvenue sur Frigo Magique !
      </h1>

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
