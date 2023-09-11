import React from "react";
import Navigation from "../Components/Navigation";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "../Components/Recipes/Header";

const WideRoot = () => {
	const location = useLocation();

	return (
		<>
			<Navigation />
			{(location.pathname === "/" ||
				location.pathname === "/recipes") && <Header />}

			<Outlet />
		</>
	);
};

export default WideRoot;
