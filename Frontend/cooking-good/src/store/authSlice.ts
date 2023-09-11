import { createSlice } from "@reduxjs/toolkit";
import { TAuth } from "../types/user/TUser";

const initialState: TAuth = {
	user: null,
	token: "",
	tokenExpiration: "",
};
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (
			state,
			action: { payload: { user: any; token: string; expiration?: any } }
		) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			const tokenExpirationDate =
				action.payload.expiration ||
				new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();
			state.tokenExpiration = tokenExpirationDate;
			localStorage.setItem(
				"userData",
				JSON.stringify({
					user: action.payload.user,
					token: action.payload.token,
					expiration: tokenExpirationDate,
				})
			);
		},
		logout: (state) => {
			state.user = null;
			state.token = "";
			state.tokenExpiration = "";
			localStorage.removeItem("userData");
		},
	},
});
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
