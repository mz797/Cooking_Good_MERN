import { Typography } from "@mui/material";
import React from "react";

const EmptyState = ({ message }: myProps) => {
	return (
		<Typography variant="h5" sx={{ m: 6, textAlign: "center" }}>
			{message}
		</Typography>
	);
};

export default EmptyState;

type myProps = {
	message: string;
};
