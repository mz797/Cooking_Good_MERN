import { RecipeType } from "../../types/recipe-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlannerState {
  planner: { date: string; recipes: RecipeType[] }[];
}

const initialState: PlannerState = {
  planner: [],
};

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    loadPlanner: (state, action: PayloadAction<PlannerState>) => {
      return action.payload;
    },
  },
});

export const { loadPlanner } = plannerSlice.actions;
export default plannerSlice.reducer;
