"use client";

import { useState } from "react";
import { createRecipe } from "@/app/actions/create-recipe";

export default function AddRecipePage() {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: [],
    steps: [],
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "facile",
    category: "plat",
  });

  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);

  const [ingredientInput, setIngredientInput] = useState("");
  const [stepInput, setStepInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredientInput],
      });
      setIngredientInput("");
      setShowIngredientModal(false);
    }
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setFormData({ ...formData, steps: [...formData.steps, stepInput] });
      setStepInput("");
      setShowStepModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData envoyé :", new FormData(e.target));
    try {
      const formDataToSend = new FormData(e.target);
      formDataToSend.append("ingredients", formData.ingredients.join("|"));
      formDataToSend.append("steps", formData.steps.join("|"));

      const response = await createRecipe(formDataToSend);
      alert(response.message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="form-container" style={{ marginTop: "80px" }}>
        <h1 className="title">Ajouter une recette</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Champs cachés pour envoyer les ingrédients et étapes */}
          <input
            type="hidden"
            name="ingredients"
            value={formData.ingredients.join("|")}
          />
          <input type="hidden" name="steps" value={formData.steps.join("|")} />

          {/* Colonne de gauche */}
          <div>
            <label className="form-label">Nom de la recette</label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              required
              className="form-input"
            />

            <label className="form-label">Temps de préparation (min)</label>
            <input
              type="number"
              name="prepTime"
              onChange={handleChange}
              required
              className="form-input"
            />

            <label className="form-label">Temps de cuisson (min)</label>
            <input
              type="number"
              name="cookTime"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* Colonne de droite */}
          <div>
            <label className="form-label">Nombre de portions</label>
            <input
              type="number"
              name="servings"
              onChange={handleChange}
              required
              className="form-input"
            />

            <label className="form-label">Difficulté</label>
            <select
              name="difficulty"
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
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="entrée">Entrée</option>
              <option value="plat">Plat</option>
              <option value="dessert">Dessert</option>
            </select>
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

          {/* Bouton principal - Ajouter la recette */}
          <div className="col-span-2 mt-6">
            <button type="submit" className="guest-button">
              Ajouter la recette
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
              className="signout-button"
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
            <button type="button" onClick={addStep} className="add-button">
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setShowStepModal(false)}
              className="signout-button"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
