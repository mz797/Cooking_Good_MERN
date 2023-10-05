import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iNotification } from "../types";

const initialState: iNotification = {
  message: "",
  type: "success",
  open: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<iNotification>) => ({
      ...initialState,
      ...action.payload,
      open: true,
    }),
    addSuccessNotification: (
      state,
      action: PayloadAction<{ message: string }>
    ) => ({
      ...initialState,
      ...action.payload,
      type: "success",
      open: true,
    }),
    addErrorNotification: (
      state,
      action: PayloadAction<{ message: string }>
    ) => ({
      ...initialState,
      ...action.payload,
      type: "error",
      open: true,
    }),
    clearNotification: (state) => ({ ...state, open: false }),
  },
});

export const {
  addNotification,
  addErrorNotification,
  addSuccessNotification,
  clearNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
