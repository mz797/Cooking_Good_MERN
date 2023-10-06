import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import notificationReducer from "./reducers/notificationReducer";
import recipesReducer from "./reducers/recipesReducer";
import categoryReducer from "./reducers/CategoryReducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authSlice,
    notification: notificationReducer,
    recipes: recipesReducer,
    categories: categoryReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
