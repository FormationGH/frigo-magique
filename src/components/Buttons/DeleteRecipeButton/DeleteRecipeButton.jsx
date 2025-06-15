import { toast } from "react-toastify";

export default function DeleteRecipeButton({ recipeId, onDelete }) {
  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Es-tu sûr de vouloir supprimer cette recette ?"
    );
    if (!confirmation) return; // Annule la suppression si l’utilisateur refuse

    try {
      const response = await fetch(`/api/recipe/${recipeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return toast.error("Erreur lors de la suppression !");
      }

      toast.success("Recette supprimée avec succès !");
      onDelete(recipeId); // Mettre à jour l'affichage'
    } catch (error) {
      toast.error("Erreur serveur !");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="delete-button bg-red-500 border-[1.5px] text-white p-2 rounded-lg hover:bg-red-400 hover:scale-105"
    >
      Supprimer
    </button>
  );
}
