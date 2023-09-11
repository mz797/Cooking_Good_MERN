import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/store";
import ImageUpload from "../common/ImageUpload";

const StyledTextField = styled(TextField)`
	width: 100%;
`;

type MyProps = {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
};
type Inputs = {
	name: string;
	image: File | undefined;
};

const AddCategory = ({ open, onClose, onSave }: MyProps) => {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<Inputs>({
		mode: "onTouched",
		defaultValues: { name: "", image: undefined },
	});

	const token = useSelector((state: RootState) => state.auth.token);

	const selectedImageHandler = (file: File | undefined) => {
		setValue("image", file);
	};

	const onSubmit = async (data: Inputs) => {
		console.log(data);

		const formData = new FormData();

		formData.append("name", data.name);
		console.log("1", formData);

		if (data.image !== undefined) {
			formData.append("image", data.image);
		}
		fetch("http://localhost:8080/category", {
			method: "POST",
			body: formData,
			headers: { Authorization: "Bearer " + token },
		})
			.then((res) => {
				console.log(res);
				onClose();
				onSave();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle sx={{ borderBottom: "1px solid #eee" }}>
				Dodaj nową kategorię
			</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent sx={{ p: 2 }}>
					<Stack sx={{ p: 1 }} alignItems="center">
						<StyledTextField
							autoFocus
							error={!!errors.name}
							helperText={errors.name?.message}
							label="Nazwa*"
							{...register("name", {
								required: {
									value: true,
									message: "Pole jest wymagane",
								},
								maxLength: {
									value: 50,
									message:
										"Nazwa może mieć maksymalnie 25 znaków",
								},
							})}
							sx={{ mb: 2, width: { sm: 350 } }}
						/>
						<Box>
							<ImageUpload
								id="image"
								register={{
									...register("image", {
										required: {
											value: true,
											message: "Pole jest wymagane",
										},
									}),
								}}
								onInput={selectedImageHandler}
								error={!!errors.image}
								helperText={errors.image?.message || ""}
								sx={{
									height: 150,
									width: 150,
									borderRadius: "50%",
									overflow: "hidden",
								}}
							/>
						</Box>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={onClose} type="button">
						Anuluj
					</Button>
					<Button variant="contained" type="submit">
						Zapisz
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default AddCategory;
