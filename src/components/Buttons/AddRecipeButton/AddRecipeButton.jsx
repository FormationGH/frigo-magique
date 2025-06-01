import Link from "next/link";
import Button from "@/components/Buttons/Button/Button";

export default function AddRecipeButton() {
  return (
    <Link href="/add-recipe" className="flex flex-col items-center gap-2">
      {/* Icône cliquable */}
      <Button className="guest-button p-3 rounded-full mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8m5 9H9v4H7V9H3V7h4V3h2v4h4z"
          />
        </svg>
      </Button>

      {/* Texte sous l’icône */}
      <span className="text-sm text-[#7EAF50] mb-10">
        Ajouter une nouvelle recette
      </span>
    </Link>
  );
}
