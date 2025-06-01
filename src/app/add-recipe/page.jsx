"use client";

import { useEffect, useState, useRef } from "react";
import { createRecipe } from "@/app/actions/create-recipe";
import Button from "@/components/Buttons/Button/Button";
import { useRouter } from "next/navigation";

export default function AddRecipePage({ closeModal }) {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: [],
    steps: [],
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "facile",
    category: "",
  });

  const [session, setSession] = useState(null);
  const router = useRouter();

  // Vérifier si l’utilisateur est connecté au chargement
  useEffect(() => {
    fetch(`/api/auth/session`)
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, []);

  const titleInputRef = useRef(null);
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [ingredientInput, setIngredientInput] = useState("");
  const [stepInput, setStepInput] = useState("");

  const [recipeLink, setRecipeLink] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

    try {
      const formDataToSend = new FormData(e.target);
      formDataToSend.append("ingredients", formData.ingredients.join("|"));
      formDataToSend.append("steps", formData.steps.join("|"));

      const response = await createRecipe(formDataToSend);

      if (response.success) {
        const finalCategory =
          formData.category || formDataToSend.get("category");

        setRecipeLink(`/categories/${finalCategory}/recipes/${response.id}`);

        setShowModal(true);
        setModalMessage(response.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Vérification avant d'afficher le formulaire
  if (!session || !session.user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-[#ab833d]">Accès restreint</h2>
          <p className="text-red-500 text-sm mb-3">
            Connectez-vous pour ajouter une recette.
          </p>
          <button
            onClick={() => router.push("/login/signup")}
            className="add-button mr-5"
          >
            Se connecter
          </button>

          <button
            onClick={() => router.push("/")}
            className="close-button mt-4"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-[#ab833d]">
          Ajouter une recette
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
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
              ref={titleInputRef}
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
              <option value="starters">Entrée</option>
              <option value="main-courses">Plat</option>
              <option value="desserts">Dessert</option>
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
        {/* Bouton */}
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
