import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeType } from "../../types/recipe-types";

interface RecipesState {
  recipesList: RecipeType[];
  recipeDetail: RecipeType | null;
  isLoading: boolean;
}

const initialState: RecipesState = {
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
    loadRecipesListSuccess: (
      state,
      action: PayloadAction<RecipeType[] | []>
    ) => ({
      ...state,
      recipesList: action.payload,
      isLoading: false,
    }),
    loadRecipesListFailure: (state) => ({
      ...state,
      isLoading: false,
    }),
    addRecipeToList: (state) => ({
      ...state,
      isLoading: true,
    }),
    addRecipeToListSuccess: (state, action: PayloadAction<RecipeType>) => ({
      ...state,
      isLoading: false,
      recipeList: [...state.recipesList, action.payload],
    }),
    addRecipeToListFailure: (state) => ({
      ...state,
      isLoading: false,
    }),
    deleteRecipeFromList: (state) => ({
      ...state,
      isLoading: true,
    }),
    deleteRecipeFromListSuccess: (state, action: PayloadAction<string>) => ({
      ...state,
      isLoading: false,
      recipesList: state.recipesList.filter(
        (recipe) => recipe.id !== action.payload
      ),
    }),
    deleteRecipeFromListFailure: (state) => ({
      ...state,
      isLoading: false,
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
    updateRecipeFromListFailure: (state) => ({
      ...state,
      isLoading: false,
    }),

    //SINGLE RECIPE

    loadRecipeDetails: (state) => ({
      ...state,
      recipeDetail: null,
      isLoading: true,
    }),
    loadRecipeDetailsSuccess: (state, action: PayloadAction<RecipeType>) => ({
      ...state,
      recipeDetail: action.payload,
      isLoading: false,
    }),
    loadRecipeDetailsFailure: (state) => ({
      ...state,
      isLoading: false,
    }),

    switchRecipeDetailsSuccess: (state, action: PayloadAction<RecipeType>) => ({
      ...state,
      recipeDetail: action.payload,
      isLoading: false,
    }),
    // addRateFailure: (state) => ({
    //   ...state,
    //   isLoading: false,
    // }),
    //
    // addComment: (state) => ({
    //   ...state,
    //   isLoading: true,
    // }),
    // addCommentSuccess: (state, action: PayloadAction<RecipeType>) => ({
    //   ...state,
    //   recipeDetail: action.payload,
    //   isLoading: false,
    // }),
    // addCommentFailure: (state) => ({
    //   ...state,
    //   isLoading: false,
    // }),
    //
    // addToFavorites: (state) => ({
    //   ...state,
    //   isLoading: true,
    // }),
    // addToFavoritesSuccess: (state, action: PayloadAction<RecipeType>) => ({
    //   ...state,
    //   recipeDetail: action.payload,
    //   isLoading: false,
    // }),
    // addToFavoritesFailure: (state) => ({
    //   ...state,
    //   isLoading: false,
    // }),
    //
    // deleteFavorites: (state) => ({
    //   ...state,
    //   isLoading: true,
    // }),
    // deleteFavoritesSuccess: (state, action: PayloadAction<RecipeType>) => ({
    //   ...state,
    //   recipeDetail: action.payload,
    //   isLoading: false,
    // }),
    // deleteFavoritesFailure: (state) => ({
    //   ...state,
    //   isLoading: false,
    // }),
    //
    // addImageToRecipeSuccess: (state, action: PayloadAction<RecipeType>) => ({
    //   ...state,
    //   recipeDetail: action.payload,
    // }),
  },
});

export const {
  loadRecipesList,
  loadRecipesListSuccess,
  loadRecipesListFailure,
  addRecipeToListSuccess,
  addRecipeToList,
  addRecipeToListFailure,
  updateRecipeFromListSuccess,
  updateRecipeFromList,
  updateRecipeFromListFailure,
  deleteRecipeFromList,
  deleteRecipeFromListSuccess,
  deleteRecipeFromListFailure,
  loadRecipeDetails,
  loadRecipeDetailsSuccess,
  loadRecipeDetailsFailure,
  switchRecipeDetailsSuccess,
  // addRate,
  // addRateSuccess,
  // addRateFailure,
  // addComment,
  // addCommentSuccess,
  // addCommentFailure,
  // addToFavorites,
  // addToFavoritesSuccess,
  // addToFavoritesFailure,
  // deleteFavorites,
  // deleteFavoritesSuccess,
  // deleteFavoritesFailure,
  // addImageToRecipeSuccess,
} = recipesSlice.actions;
export default recipesSlice.reducer;
