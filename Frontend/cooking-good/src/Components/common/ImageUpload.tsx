import { Typography, Button, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface myProps {
	id: string;
	register: any;
	helperText: string;
	error: boolean;
	sx?: object;
	defaultValue?: string;
	onInput: (file: File | undefined) => void;
}
const ImageUpload = ({
	id,
	register,
	error,
	helperText,
	onInput,
	defaultValue,
	sx,
}: myProps) => {
	const filePickerRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | undefined>();
	const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>();

	useEffect(() => {
		if (!!defaultValue) {
			setPreviewUrl(
				"http://localhost:8080/" + defaultValue.replace("\\", "/")
			);
		}
	}, []);
	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};

		fileReader.readAsDataURL(file);
	}, [file]);

	const pickedHandler = (e: ChangeEvent<HTMLInputElement>) => {
		let pickedFile;
		if (e.target.files && e.target.files.length === 1) {
			pickedFile = e.target.files[0];
			setFile(pickedFile);
		}
		onInput(pickedFile);
	};

	const pickImageHandler = () => {
		filePickerRef?.current?.click();
	};

	return (
		<Box sx={{ width: "100%", height: "100%" }}>
			<input
				type="file"
				{...register}
				ref={filePickerRef}
				id={id}
				style={{ display: "none" }}
				accept=".jpg,.png,.jpeg"
				onChange={pickedHandler}
			/>
			<Box
				sx={{
					width: "100%",
					height: "100%",
					backgroundImage: `url(${previewUrl?.toString() || ""})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					border: "1px solid black",
					borderRadius: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					...sx,
				}}>
				<Button
					sx={{
						height: "100%",
						width: "100%",
						background: "rgba(0,0,0,.45)",
						"&:hover": { background: "rgba(0,0,0,.55)" },
					}}
					size="large"
					aria-label="Wybierz zdjęcie"
					onClick={pickImageHandler}
					type="button">
					<AddPhotoAlternateIcon
						sx={{ fontSize: 48, color: "#ffffff" }}
					/>
				</Button>
			</Box>

			{!!helperText && (
				<Typography
					variant="body2"
					sx={{
						fontSize: 12,
						color: (theme) => theme.palette.error.main,
						ml: "14px",
						mt: "3px",
					}}>
					{helperText}
				</Typography>
			)}
		</Box>
	);
};

export default ImageUpload;
