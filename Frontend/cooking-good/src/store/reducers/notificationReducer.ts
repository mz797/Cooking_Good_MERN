import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IncompleteType } from "typescript";
import { SET_NOTIFICATION, NotificationAction, iNotification } from "../types";

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
		clearNotification: (state) => ({ ...state, open: false }),
	},
});

export const { addNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
