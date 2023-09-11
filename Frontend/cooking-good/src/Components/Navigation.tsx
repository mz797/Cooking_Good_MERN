import {
	AppBar,
	Button,
	Container,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";

export const RouterLink = styled(NavLink)`
	color: white;
	text-decoration: none;
	font-size: 18px;
	transition: 0.3s;
`;

const Navigation = () => {
	const token = useSelector((state: RootState) => state.auth.token);
	const user = useSelector((state: RootState) => state.auth.user);
	console.log(user);

	const dispatch = useDispatch();
	const handleLogout = () => {
		dispatch(logout());
	};
	return (
		<AppBar
			position="static"
			sx={{ background: (theme) => theme.color.header }}>
			<Container maxWidth="xl">
				<Toolbar
					sx={{ display: "flex", justifyContent: "space-between" }}>
					<Stack direction="row" alignItems="center" spacing={2}>
						<CookieIcon
							fontSize="large"
							sx={{
								color: (theme) => theme.palette.text.light,
							}}
						/>
						<Typography
							variant="h4"
							sx={{
								fontFamily: "Dancing Script, cursive",
								m: 0,
								alignItems: "flex-end",
								color: (theme) => theme.palette.text.light,
							}}>
							Cookinng Good
						</Typography>
					</Stack>
					<Stack spacing={3} direction="row" alignItems="center">
						<RouterLink to="/recipes">Przepisy</RouterLink>

						{!token && (
							<>
								<RouterLink to="/auth/login">
									Zaloguj się
								</RouterLink>
								<RouterLink to="/auth/signup">
									Zarejestruj się
								</RouterLink>
							</>
						)}
						{token && (
							<>
								<RouterLink to="/add-recipe">
									Dodaj przepis
								</RouterLink>
								<RouterLink to="/categories">
									Kategorie
								</RouterLink>
								<RouterLink to="/reports">
									Zgłoszenia
								</RouterLink>
								<RouterLink
									to={`/user-profile/${user?.userId}`}>
									Panel użytkownika
								</RouterLink>
								<RouterLink to="/users">Użytkownicy</RouterLink>
								<RouterLink to="/cart">
									Lista Zakupów
								</RouterLink>
								<RouterLink to="/planner">Planer</RouterLink>
								<Button
									component={RouterLink}
									onClick={handleLogout}
									sx={{ color: "white" }}>
									Wyloguj się
								</Button>
							</>
						)}
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navigation;
