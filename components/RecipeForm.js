import { ingredients } from "@/lib/ingredients";
import { symptoms } from "@/lib/symptoms";
import { useState } from "react";
import styled from "styled-components";
import { getSuggestion } from "@/utils/get-suggestions";
import { useRouter } from "next/router";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 20px;
`;

const ListItemSelectedValues = styled.li`
  display: flex;
  gap: 2vw;
  border: solid grey 2px;
  border-radius: 5px;
  width: auto;
  padding: 0 2vw;
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 5px 0;
`;

export default function RecipeForm({ onAddRecipe }) {
  const router = useRouter();

  const [ingredientSuggestion, setIngredientSuggestion] = useState();
  const [symptomSuggestion, setSymptomSuggestion] = useState();
  const [ingredientsInput, _setIngredientsInput] = useState("");
  const [symptomsInput, _setSymptomsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState({ field: "", message: "" });

  function setIngredientsInput(inputValue) {
    if (inputValue.includes(",")) {
    } else {
      _setIngredientsInput(inputValue);
    }
  }

  function setSymptomsInput(inputValue) {
    if (inputValue.includes(",")) {
    } else {
      _setSymptomsInput(inputValue);
    }
  }

  function handleIngredientsChange(event) {
    const userInput = event.target.value;
    getSuggestion(userInput, ingredients, setIngredientSuggestion);
    setIngredientsInput(userInput || "");
    setErrorMessage("");
  }

  function handleSymptomsChange(event) {
    const userInput = event.target.value;
    getSuggestion(userInput, symptoms, setSymptomSuggestion);
    setSymptomsInput(userInput || "");
    setErrorMessage("");
  }

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  function selectSuggestedIngredient() {
    selectedIngredients.includes(ingredientSuggestion) ||
      setSelectedIngredients([...selectedIngredients, ingredientSuggestion]);
    setIngredientsInput("");
  }

  function selectUserIngredient(event) {
    if (
      event.key === "," &&
      ingredientsInput &&
      !selectedIngredients.includes(event.target.value.slice(0).trim())
    ) {
      setSelectedIngredients([
        ...selectedIngredients,
        event.target.value.slice(0).trim(),
      ]);
      setIngredientsInput("");
    }
  }

  function deleteSelectedIngredient(ingredientToBeDeleted) {
    setSelectedIngredients(
      selectedIngredients.filter(
        (ingredient) => ingredient !== ingredientToBeDeleted
      )
    );
  }

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  function selectSuggestedSymptom() {
    selectedSymptoms.includes(symptomSuggestion) ||
      setSelectedSymptoms([...selectedSymptoms, symptomSuggestion]);
    setSymptomsInput("");
  }

  function selectUserSymptom(event) {
    if (
      event.key === "," &&
      symptomsInput &&
      !selectedSymptoms.includes(event.target.value.slice(0).trim())
    ) {
      setSelectedSymptoms([
        ...selectedSymptoms,
        event.target.value.slice(0).trim(),
      ]);
      setSymptomsInput("");
    }
  }

  function deleteSelectedSymptom(symptomToBeDeleted) {
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => symptom !== symptomToBeDeleted)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedIngredients.length === 0) {
      setErrorMessage({
        field: "ingredients",
        message: "Please add at least one ingredient.",
      });
      return;
    } else if (selectedSymptoms.length === 0) {
      setErrorMessage({
        field: "symptoms",
        message: "Please add at least one symptom.",
      });
      return;
    }
    setErrorMessage({ field: "", message: "" });
    const formData = new FormData(event.target);
    const userRecipe = Object.fromEntries(formData);
    userRecipe.ingredients = [...selectedIngredients, userRecipe.ingredients];
    userRecipe.symptoms = [...selectedSymptoms, userRecipe.symptoms];
    onAddRecipe(userRecipe);
    router.push("/");
  }

  return (
    <>
      <h2>Add your Recipe</h2>
      <StyledForm onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          placeholder="What's the recipe's name?"
          min="1"
          max="150"
          id="title"
          name="title"
          required
        ></input>
        <label htmlFor="ingredients">Ingredients</label>
        <input
          value={ingredientsInput}
          type="text"
          placeholder="Separate the ingredients by comma"
          min="1"
          max="150"
          id="ingredients"
          name="ingredients"
          onChange={handleIngredientsChange}
          onKeyPress={selectUserIngredient}
        ></input>
        {errorMessage.field === "ingredients" && (
          <ErrorMessage>{errorMessage.message}</ErrorMessage>
        )}
        {ingredientSuggestion && (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={selectSuggestedIngredient}
          >
            Click to select suggestion: {ingredientSuggestion}
          </div>
        )}
        <ul>
          {selectedIngredients.map((ingredient) => (
            <ListItemSelectedValues key={ingredient}>
              <p>{ingredient}</p>
              <p
                style={{
                  cursor: "pointer",
                }}
                onClick={() => deleteSelectedIngredient(ingredient)}
              >
                ❌
              </p>
            </ListItemSelectedValues>
          ))}
        </ul>
        <label htmlFor="preparation">Preparation</label>
        <input
          type="text"
          placeholder="e.g Add thyme to the water"
          min="1"
          max="150"
          required
          id="preparation"
          name="preparation"
        ></input>
        <label htmlFor="usage">Usage</label>
        <input
          type="text"
          placeholder="How to use it?"
          min="4"
          max="300"
          required
          id="usage"
          name="usage"
        ></input>
        <label htmlFor="symptoms">Symptoms</label>
        <input
          value={symptomsInput}
          type="text"
          placeholder="min 2 Symptoms"
          id="symptoms"
          name="symptoms"
          onChange={handleSymptomsChange}
          onKeyPress={selectUserSymptom}
        ></input>
        {errorMessage.field === "symptoms" && (
          <ErrorMessage>{errorMessage.message}</ErrorMessage>
        )}
        {symptomSuggestion && (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={selectSuggestedSymptom}
          >
            Click to select suggestion: {symptomSuggestion}
          </div>
        )}
        <ul>
          {selectedSymptoms.map((symptom) => (
            <li key={symptom}>
              <p>{symptom}</p>
              <p
                style={{
                  cursor: "pointer",
                }}
                onClick={() => deleteSelectedSymptom(symptom)}
              >
                ❌
              </p>
            </li>
          ))}
        </ul>
        <button type="submit">Add Recipe</button>
      </StyledForm>
    </>
  );
}