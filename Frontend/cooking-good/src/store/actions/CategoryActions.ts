import { AppDispatch } from "../store";
import axios from "axios";
import {
  deleteCategorySuccess,
  loadCategoryDetails,
  loadCategoryDetailsFailure,
  loadCategoryDetailsSuccess,
  loadCategoryList,
  loadCategoryListFailure,
  loadCategoryListSuccess,
} from "../reducers/CategoryReducer";
import {
  addErrorNotification,
  addSuccessNotification,
} from "../reducers/notificationReducer";

export const loadCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadCategoryList());
    const response = await axios.get("http://localhost:8080/category");
    if (response.status === 200 || response.status === 201) {
      dispatch(loadCategoryListSuccess(response.data.categories));
    }
  } catch (err) {
    dispatch(loadCategoryListFailure());
    dispatch(
      addErrorNotification({
        message: `Nie udało się pobrać listy kategorii`,
      })
    );
  }
};

export const deleteCategoryAsync =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/category/${categoryId}`
      );

      if (response.status === 200 || response.status === 201) {
        dispatch(deleteCategorySuccess(categoryId));
        dispatch(
          addSuccessNotification({
            message: `Usunięto kategorię`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: `Nie udało się usunąć kategorii`,
        })
      );
    }
  };

export const loadCategoryDetailsAsync =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loadCategoryDetails());
      const response = await axios.get(
        `http://localhost:8080/category/${categoryId}`
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(loadCategoryDetailsSuccess(response.data.category));
      }
    } catch (err) {
      dispatch(loadCategoryDetailsFailure());
      dispatch(
        addErrorNotification({
          message: `Nie udało się pobrać kategorii`,
        })
      );
    }
  };
