import { ICategory } from "../../types/category-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categoryList: ICategory[];
  categoryDetails: ICategory | null;
  isLoading: boolean;
}

const initialState: CategoryState = {
  categoryList: [],
  categoryDetails: null,
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
      ...state,
      categoryList: action.payload,
      isLoading: false,
    }),
    loadCategoryListFailure: (state) => ({
      ...state,
      isLoading: false,
    }),

    deleteCategorySuccess: (state, action: PayloadAction<string>) => ({
      ...state,
      categoryList: state.categoryList.filter((c) => c.id !== action.payload),
    }),

    //SINGLE RECIPE

    loadCategoryDetails: (state) => ({
      ...state,
      categoryDetails: null,
      isLoading: true,
    }),
    loadCategoryDetailsSuccess: (state, action: PayloadAction<ICategory>) => ({
      ...state,
      categoryDetails: action.payload,
      isLoading: false,
    }),
    loadCategoryDetailsFailure: (state) => ({
      ...state,
      isLoading: false,
    }),
    switchCategoryDetailsSuccess: (
      state,
      action: PayloadAction<ICategory>
    ) => ({
      ...state,
      categoryDetails: action.payload,
      isLoading: false,
    }),
  },
});

export const {
  loadCategoryList,
  loadCategoryListSuccess,
  loadCategoryListFailure,
  loadCategoryDetails,
  loadCategoryDetailsSuccess,
  loadCategoryDetailsFailure,
  deleteCategorySuccess,
} = categorySlice.actions;
export default categorySlice.reducer;
