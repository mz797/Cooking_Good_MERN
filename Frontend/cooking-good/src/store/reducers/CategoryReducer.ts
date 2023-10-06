import { ICategory } from "../../types/category-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categoryList: ICategory[];
  isLoading: boolean;
}

const initialState: CategoryState = {
  categoryList: [],
  isLoading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    loadCategoryList: (state) => ({
      ...state,
      isLoading: true,
    }),
    loadCategoryListSuccess: (state, action: PayloadAction<ICategory[]>) => ({
      categoryList: action.payload,
      isLoading: false,
    }),
    loadCategoryListFailure: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const {
  loadCategoryList,
  loadCategoryListSuccess,
  loadCategoryListFailure,
} = categorySlice.actions;
export default categorySlice.reducer;
