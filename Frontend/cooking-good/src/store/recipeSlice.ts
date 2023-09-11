import { createSlice } from "@reduxjs/toolkit";
import { RecipeType } from "../types/recipe-types";

const initialState: { recipes: RecipeType[] } = {
	recipes: [],
};
export const recipeSlice = createSlice({
	name: "recipe",
	initialState,
	reducers: {
		addRecipe: (state, action) => {
			state.recipes.push(action.payload);
		},
	},
});
