import { useEffect, useRef, useState } from "react";
import Button from "../Buttons/Button/Button";
import Spinner from "../Spinner/Spinner";
import errorMessages from "@/utils/error";

export default function AddRecipeForm({
  handleSubmit,
  closeModal,
  formData,
  handleChange,
  titleInputRef,
  setImage,
  setShowIngredientModal,
  setShowStepModal,
  addIngredient,
  addStep,
  showIngredientModal,
  showStepModal,
  ingredientInput,
  setIngredientInput,
  stepInput,
  setStepInput,
  showModal,
  setShowModal,
  modalMessage,
  recipeLink,
}) {
  const [loading, setLoading] = useState(false); // État de chargement
  const [message, setMessage] = useState(""); // Message de confirmation ou erreur
  const fileInputRef = useRef(null);

  useEffect(() => {}, [loading]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (loading) return; // Empêche les soumissions multiples

    setLoading(true); // Active le `Spinner`
    setMessage(""); // Réinitialise le message

    try {
      await handleSubmit(e); // Exécute la soumission
      setMessage("Recette ajoutée avec succès !");
      // Réinitialisation du champ file
      fileInputRef.current.value = "";
    } catch (error) {
      setMessage(errorMessages.serverError);
    }

    setLoading(false); // Désactive le `Spinner`
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto mt-20">
        <h2 className="text-xl font-bold text-[#ab833d]">
          Ajouter une recette
        </h2>
        <form onSubmit={handleFormSubmit} className="mt-4">
          {/* Champs cachés pour envoyer les ingrédients et étapes */}
          <input
            type="hidden"
            name="ingredients"
            value={formData.ingredients.join("|")}
          />
          <input type="hidden" name="steps" value={formData.steps.join("|")} />

          {/* Formulaire pour ajouter une recette */}
          <div>
            <label className="form-label">Nom de la recette</label>
            <input
              ref={titleInputRef}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />

            <label className="form-label">Temps de préparation (min)</label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              required
              className="form-input"
            />

            <label className="form-label">Temps de cuisson (min)</label>
            <input
              type="number"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Nombre de portions</label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              required
              className="form-input"
            />

            <label className="form-label">Difficulté</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>

            <label className="form-label">Catégorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="starters">Entrée</option>
              <option value="main-courses">Plat</option>
              <option value="desserts">Dessert</option>
            </select>

            <label className="form-label">Photo de la recette</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              className="form-input"
            />
          </div>

          {/* Boutons pour ajouter ingrédients et étapes */}
          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowIngredientModal(true)}
              className="add-button"
            >
              Ajouter un ingrédient
            </button>
            <button
              type="button"
              onClick={() => setShowStepModal(true)}
              className="add-button"
            >
              Ajouter une étape
            </button>
          </div>

          {/* Liste des ingrédients */}
          <ul
            hidden={!formData.ingredients.length}
            className="col-span-2 mt-2 bg-gray-100 p-4 rounded-lg"
          >
            {formData.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm">
                ✔ {ingredient}
              </li>
            ))}
          </ul>

          {/* Liste des étapes */}
          <ul
            hidden={!formData.steps.length}
            className="col-span-2 mt-2 bg-gray-100 p-4 rounded-lg"
          >
            {formData.steps.map((step, index) => (
              <li key={index} className="text-sm">
                Étape {index + 1}: {step}
              </li>
            ))}
          </ul>

          <div className="col-span-2 mt-6 flex gap-x-4 justify-center">
            {/* Affichage du Spinner et du message */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                <Spinner />
              </div>
            )}
            {/* Bouton principal - Ajouter la recette */}
            <button type="submit" className="guest-button">
              Ajouter la recette
            </button>
            {/* Bouton Fermer*/}
            <button type="button" onClick={closeModal} className="close-button">
              Fermer
            </button>
          </div>
        </form>
      </div>

      {/* Modale pour ajouter un ingrédient */}
      {showIngredientModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="form-container space-x-4 space-y-4">
            <h2 className="title">Ajouter un ingrédient</h2>
            <input
              type="text"
              placeholder="Ex: farine, œufs..."
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              className="form-input"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="add-button"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setShowIngredientModal(false)}
              className="close-button"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modale pour ajouter une étape */}
      {showStepModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="form-container space-x-4 space-y-4">
            <h2 className="title">Ajouter une étape</h2>
            <input
              type="text"
              placeholder="Ex: Mélanger la farine..."
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              className="form-input"
            />
            <Button type="button" onClick={addStep} className="add-button">
              Ajouter
            </Button>
            <Button
              type="button"
              onClick={() => setShowStepModal(false)}
              className="close-button"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
      {showModal && recipeLink && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="form-container space-x-4 space-y-4">
            <h2 className="title">{modalMessage}</h2>
            <a href={recipeLink} className="add-button">
              Voir la recette
            </a>
            <Button
              onClick={() => setShowModal(false)}
              className="close-button"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
