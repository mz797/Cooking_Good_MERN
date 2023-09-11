import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/authSlice";
import { RootState } from "../store/store";

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
	const dispatch = useDispatch();
	const tokenExpirationDate = useSelector(
		(state: RootState) => state.auth.tokenExpiration
	);

	const [token, setToken] = useState<string>("");

	useEffect(() => {
		if (localStorage.getItem("userData") !== null) {
			const storedData = JSON.parse(
				localStorage.getItem("userData") || "{}"
			);
			if (
				!!storedData &&
				!!storedData.token &&
				new Date(storedData.expiration) > new Date()
			) {
				setToken(storedData.token);
				dispatch(
					login({
						user: storedData.user,
						token: storedData.token,
						expiration: storedData.expiration,
					})
				);
			}
		}
	}, []);

	useEffect(() => {
		if (!!token && tokenExpirationDate) {
			const remainingTime =
				new Date(tokenExpirationDate).getTime() - new Date().getTime();
			logoutTimer = setTimeout(() => {
				dispatch(logout());
			}, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, tokenExpirationDate]);

	return { token };
};
