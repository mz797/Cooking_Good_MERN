import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import notificationReducer from "./reducers/notificationReducer";
import recipesReducer from "./reducers/recipesReducer";
import categoryReducer from "./reducers/CategoryReducer";
import themeReducer from "./reducers/themeReducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import plannerReducer from "./reducers/PlannerReducer";

const store = configureStore({
  reducer: {
    auth: authSlice,
    notification: notificationReducer,
    recipes: recipesReducer,
    categories: categoryReducer,
    theme: themeReducer,
    planner: plannerReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
