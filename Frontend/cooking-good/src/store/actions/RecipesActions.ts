import { AppDispatch } from "../store";
import {
  addRecipeToList,
  addRecipeToListFailure,
  addRecipeToListSuccess,
  deleteRecipeFromList,
  deleteRecipeFromListFailure,
  deleteRecipeFromListSuccess,
  loadRecipeDetails,
  loadRecipeDetailsFailure,
  loadRecipeDetailsSuccess,
  loadRecipesList,
  loadRecipesListFailure,
  loadRecipesListSuccess,
  switchRecipeDetailsSuccess,
  updateRecipeFromList,
  updateRecipeFromListFailure,
  updateRecipeFromListSuccess,
} from "../reducers/recipesReducer";
import axios from "axios";
import {
  addErrorNotification,
  addSuccessNotification,
} from "../reducers/notificationReducer";

export const loadRecipes = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadRecipesList());
    const response = await axios.get("http://localhost:8080/recipe/");
    if (response.status === 200) {
      dispatch(loadRecipesListSuccess(response.data.recipes));
    }
  } catch (err) {
    dispatch(loadRecipesListFailure());
    dispatch(
      addErrorNotification({
        message: "Nie udało się pobrać listy przepisów.",
      })
    );
  }
};

export const addRecipe =
  (formData: FormData, token: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(addRecipeToList());
      const response = await axios.post(
        `http://localhost:8080/recipe`,
        formData,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 201 || response.status === 200) {
        dispatch(addRecipeToListSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: "Dodano przepis.",
          })
        );
      }
    } catch (err) {
      dispatch(addRecipeToListFailure());
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać przepisu.",
        })
      );
    }
  };
export const editRecipe =
  (formData: FormData, recipeId: string, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(updateRecipeFromList());
      const response = await axios.put(
        `http://localhost:8080/recipe/${recipeId}`,
        formData,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 201 || response.status === 200) {
        dispatch(updateRecipeFromListSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: "Edytowano przepis.",
          })
        );
      }
    } catch (err) {
      dispatch(updateRecipeFromListFailure());
      dispatch(
        addErrorNotification({
          message: "Nie udało się edytować przepisu.",
        })
      );
    }
  };
export const deleteRecipe =
  (recipeId: string, token: string) => (dispatch: AppDispatch) => {
    dispatch(deleteRecipeFromList());
    return axios
      .delete(`http://localhost:8080/recipe/${recipeId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        dispatch(deleteRecipeFromListSuccess(recipeId));
        dispatch(
          addSuccessNotification({
            message: "Usunięto przepis.",
          })
        );
      })
      .catch((err) => {
        dispatch(deleteRecipeFromListFailure());
        dispatch(
          addErrorNotification({
            message: "Nie udało się usunąć przepisu.",
          })
        );
      });
  };

//SINGLE RECIPE

export const loadSingleRecipe =
  (recipeId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loadRecipeDetails());
      const response = await axios.get(
        `http://localhost:8080/recipe/${recipeId}`
      );
      if (response.status === 200) {
        dispatch(loadRecipeDetailsSuccess(response.data.recipe));
      }
    } catch (err) {
      dispatch(loadRecipeDetailsFailure());
      dispatch(
        addErrorNotification({
          message: "Nie udało się załadować przepisu.",
        })
      );
    }
  };

export const addRateToRecipe =
  (recipeId: string, value: number, userId: string, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/recipe/rate/${recipeId}`,
        { rate: { rate: value, creator: userId } },

        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 200) {
        dispatch(switchRecipeDetailsSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: `Dodano ocenę do przepisu '${response.data.recipe.name}'.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać oceny do przepisu.",
        })
      );
    }
  };
export const addCommentToRecipe =
  (recipeId: string, comment: commentType, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/recipe/comment/${recipeId}`,
        {
          comment: comment,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(switchRecipeDetailsSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: `Dodano komentarz do przepisu '${response.data.recipe.name}'.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać komentarza do przepisu.",
        })
      );
    }
  };
export const addRecipeToFavorites =
  (recipeId: string, userId: string, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/add-favorite/${userId}/${recipeId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(switchRecipeDetailsSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: `Dodano przepis '${response.data.recipe.name}' do ulubionych.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać przepisu do ulubionych.",
        })
      );
    }
  };
export const deleteRecipeFromFavorites =
  (recipeId: string, userId: string, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/delete-favorite/${userId}/${recipeId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(switchRecipeDetailsSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: `Usunięto przepis '${response.data.recipe.name}' z ulubionych.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się usunąć przepisu z ulubionych.",
        })
      );
    }
  };

export const addCommentImage =
  (recipeId: string, formData: FormData, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/recipe/comment-image/${recipeId}`,
        formData,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(switchRecipeDetailsSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: `Dodano zdjęcie do przepisu '${response.data.recipe.name}'.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać zdjęcia do przepisu.",
        })
      );
    }
  };
export const deleteCommentImage =
  (recipeId: string, imageId: string, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/recipe/comment-image/${recipeId}/${imageId}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(switchRecipeDetailsSuccess(response.data.recipe));
        dispatch(
          addSuccessNotification({
            message: `Usunięto zdjęcie z przepisu '${response.data.recipe.name}'.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się usunąć zdjęcia z przepisu.",
        })
      );
    }
  };

export const addIngredientsToShoppingList =
  (
    selectedIngredients: selectedIngredientType[],
    userId: string,
    token: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/users/shopping-list/${userId}`,
        {
          ingredients: selectedIngredients,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(
          addSuccessNotification({
            message: `Dodano nowe składniki do listy zakupów.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się dodać składników do listy zakupów.",
        })
      );
    }
  };

type commentType = {
  content: string;
  creator: string;
  reports: never[];
  addedAt: Date;
};
type selectedIngredientType = { name: string; amount: string };
