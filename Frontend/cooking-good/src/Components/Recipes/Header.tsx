import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";

const Header = () => {
	return (
		<Box
			sx={{
				height: "calc( 60vh - 64px )",
				backgroundImage: `url(http://localhost:8080/uploads/images/background.jpg)`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}>
			<Stack
				justifyContent="center"
				spacing={2}
				sx={{
					backdropFilter: " blur(1px)",
					background: "rgba(0,0,0,.05)",
					py: 6,
					px: { xs: 6, md: 12 },
					width: "100%",
					height: "100%",
					color: (theme) => theme.palette.text.light,
				}}>
				<Typography
					variant="h3"
					sx={{
						textAlign: "center",
						textShadow: (theme) =>
							`0 0 5px ${theme.palette.text.primary}`,
					}}>
					Przepisy, które łączą smaki i ludzi.
				</Typography>
				<Typography
					variant="h5"
					sx={{
						textAlign: "center",
						textShadow: (theme) =>
							`0 0 5px ${theme.palette.text.primary}`,
					}}>
					Znajdź, stwórz i podziel się wyjątkowymi przepisami wraz z
					społecznością miłośników kulinariów. Tworzymy razem
					kulinarne arcydzieła, które inspirują i smakują!
				</Typography>
			</Stack>
		</Box>
	);
};

export default Header;
