import PersonIcon from "@mui/icons-material/Person";
import { Stack, Box, Typography } from "@mui/material";

import React from "react";

const PersonCount = ({ count, styles = {} }: myProps) => {
	return (
		<Stack alignItems="center" sx={styles}>
			<PersonIcon />
			<Typography variant="button">{count} os.</Typography>
		</Stack>
	);
};

export default PersonCount;

type myProps = {
	count: number;
	styles?: Object;
};
