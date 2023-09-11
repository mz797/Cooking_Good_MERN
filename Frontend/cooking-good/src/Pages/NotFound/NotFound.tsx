import { Container, Typography } from "@mui/material";
import React from "react";
import Navigation from "../../Components/Navigation";

const NotFound = () => {
	return (
		<>
			<Navigation />
			<Container sx={{ mb: 8 }}>
				<Typography variant="h5">Nie ma takiej strony</Typography>
			</Container>
		</>
	);
};

export default NotFound;
