import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { passwordInputType } from "../../types/propTypes/authTypes";

const StyledTextField = styled(TextField)`
	width: 100%;
`;

const PasswordInput = ({
	label,
	name,
	register,
	validation,
	error,
	sx = {},
}: passwordInputType) => {
	const [showPassword, setShowPassword] = useState<Boolean>(false);
	return (
		<StyledTextField
			sx={sx ? sx : undefined}
			label={label}
			variant="outlined"
			type={showPassword ? "text" : "password"}
			{...register(name, validation)}
			error={!!error}
			helperText={error?.message || ""}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<Tooltip title={showPassword ? "Zakryj" : "Odkryj"}>
							<IconButton
								onClick={() =>
									setShowPassword((prev) => !prev)
								}>
								{showPassword ? (
									<VisibilityOffIcon />
								) : (
									<VisibilityIcon />
								)}
							</IconButton>
						</Tooltip>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default PasswordInput;
