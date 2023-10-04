import { AppDispatch } from "../store";
import {
  loadRecipesList,
  loadRecipesListSuccess,
} from "../reducers/recipesReducer";
import axios from "axios";
import { addNotification } from "../reducers/notificationReducer";

export const loadRecipes = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadRecipesList());
    const response = await axios.get("http://localhost:8080/recipe/");
    if (response.status === 200) {
      dispatch(loadRecipesListSuccess(response.data.recipes));
    }
  } catch (err) {
    dispatch(
      addNotification({
        message: "Nie udało się pobrać listy przepisów.",
        type: "error",
        open: true,
      })
    );
  }
};
