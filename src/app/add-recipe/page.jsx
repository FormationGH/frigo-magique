"use client";

import { useEffect, useState, useRef } from "react";
import { createRecipe } from "@/app/actions/create-recipe";
// import Button from "@/components/Buttons/Button/Button";
import { useRouter } from "next/navigation";
import AddRecipeForm from "@/components/AddRecipeForm/AddRecipeForm";
import errorMessages from "@/utils/error";

export default function AddRecipePage({ showForm, setShowForm }) {
  const emptyFormData = {
    title: "",
    ingredients: [],
    steps: [],
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "facile",
    category: "",
  };
  const [formData, setFormData] = useState(emptyFormData);

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
  const [image, setImage] = useState(null); // Gère l'image sélectionnée

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

      let imageUrl = "";
      if (image) {
        try {
          const imageFormData = new FormData();
          imageFormData.append("file", image);
          imageFormData.append("upload_preset", "recipes");

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: imageFormData,
            }
          );

          if (!res.ok) throw new Error(errorMessages.imageUploadError);

          const data = await res.json();
          imageUrl = data.secure_url || "";
        } catch (error) {
          alert(errorMessages.imageUploadError);
        }
      }

      formDataToSend.append("image", imageUrl);

      const response = await createRecipe(formDataToSend);

      if (response.success) {
        const finalCategory =
          formData.category || formDataToSend.get("category");

        setRecipeLink(`/categories/${finalCategory}/recipes/${response.slug}`);

        setShowModal(true);
        setModalMessage(response.message);
        // Réinitialisation du formulaire après l'ajout
        setFormData(emptyFormData);
      }
    } catch (error) {
      alert(errorMessages.serverError);
    }
  };

  // Vérification avant d'afficher le formulaire
  if (!session || !session.user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-[#ab833d]">Accès restreint</h2>
          <p className="text-red-500 text-sm mb-3">
            {errorMessages.sessionError}
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
    <>
      {showForm && (
        <div>
          <AddRecipeForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            formData={formData}
            titleInputRef={titleInputRef}
            setImage={setImage}
            setShowIngredientModal={setShowIngredientModal}
            setShowStepModal={setShowStepModal}
            addIngredient={addIngredient}
            addStep={addStep}
            showIngredientModal={showIngredientModal}
            showStepModal={showStepModal}
            ingredientInput={ingredientInput}
            setIngredientInput={setIngredientInput}
            stepInput={stepInput}
            setStepInput={setStepInput}
            showModal={showModal}
            setShowModal={setShowModal}
            modalMessage={modalMessage}
            recipeLink={recipeLink}
            closeModal={() => setShowForm(false)}
          />
        </div>
      )}
    </>
  );
}
