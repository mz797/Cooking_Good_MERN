import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeType } from "../../types/recipe-types";

const initialState: {
  recipesList: RecipeType[];
  recipeDetail: RecipeType | null;
  isLoading: boolean;
} = {
  recipesList: [],
  recipeDetail: null,
  isLoading: false,
};
const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    loadRecipesList: (state) => ({
      ...state,
      isLoading: true,
    }),
    loadRecipesListSuccess: (state, action) => ({
      ...state,
      recipesList: action.payload,
      isLoading: false,
    }),
    addRecipeToList: (state) => ({
      ...state,
      isLoading: true,
    }),
    addRecipeToListSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      recipeList: [...state.recipesList, action.payload],
    }),
    deleteRecipeFromList: (state) => ({
      ...state,
      isLoading: true,
    }),
    deleteRecipeFromListSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      recipesList: state.recipesList.filter(
        (recipe) => recipe.id !== action.payload
      ),
    }),
    updateRecipeFromList: (state) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    updateRecipeFromListSuccess: (state, action: PayloadAction<RecipeType>) => {
      const updatedRecipeIndex = state.recipesList.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      const newList = [...state.recipesList];
      newList[updatedRecipeIndex] = action.payload;
      return {
        ...state,
        isLoading: false,
        recipesList: newList,
      };
    },
  },
});

export const {
  loadRecipesList,
  loadRecipesListSuccess,
  addRecipeToListSuccess,
  addRecipeToList,
  updateRecipeFromListSuccess,
  updateRecipeFromList,
  deleteRecipeFromListSuccess,
  deleteRecipeFromList,
} = recipesSlice.actions;
export default recipesSlice.reducer;
