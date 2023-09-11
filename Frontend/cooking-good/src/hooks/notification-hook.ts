import { useDispatch } from "react-redux";
import {
	addNotification,
	clearNotification,
} from "../store/reducers/notificationReducer";
import { iNotification } from "../store/types";

export const useNotification = () => {
	const dispatch = useDispatch();

	const displayNotification = (notification: iNotification) => {
		dispatch(addNotification(notification));
	};

	const clearMyNotification = () => {
		dispatch(clearNotification());
	};

	return {
		displayNotification,
		clearMyNotification,
	};
};
