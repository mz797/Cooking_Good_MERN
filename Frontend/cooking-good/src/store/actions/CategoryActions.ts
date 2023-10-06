import { AppDispatch } from "../store";
import axios from "axios";
import {
  loadCategoryList,
  loadCategoryListSuccess,
} from "../reducers/CategoryReducer";
import { addErrorNotification } from "../reducers/notificationReducer";

export const loadCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(loadCategoryList());
    const response = await axios.get("http://localhost:8080/category");
    if (response.status === 200 || response.status === 201) {
      dispatch(loadCategoryListSuccess(response.data.categories));
    }
  } catch (err) {
    dispatch(
      addErrorNotification({
        message: `Nie udało się pobrać listy kategorii`,
      })
    );
  }
};
