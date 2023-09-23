import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import React from "react";
import { modules } from "../../../Components/Recipes/AddRecipe/AddRecipeDescription";
import { Controller, useForm } from "react-hook-form";
import ImageUpload from "../../../Components/common/ImageUpload";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

type Inputs = {
  title: string;
  image: string | File;
  description: string;
};
const CreatePost = ({ open, onClose, onSave }: myProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onTouched", defaultValues: { title: "" } });

  const onSubmit = (data: Inputs) => {
    const formData: FormData = new FormData();
    formData.append("description", data.description);
    formData.append("title", data.title);
    formData.append("image", data.image);
    formData.append("creator", user ? user.userId : "");

    fetch("http://localhost:8080/post", {
      method: "POST",
      body: formData,
      headers: { Authorization: "Bearer " + token },
    }).then((res) => {
      reset();
      onSave();
      onClose();
    });
  };
  const selectedImageHandler = (file: File | undefined) => {
    setValue("image", file || "");
  };

  return (
    <Dialog open={open} maxWidth="md" sx={{ width: "100%" }} onClose={onClose}>
      <DialogTitle>Dodaj ciekawostkę</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            error={!!errors.title}
            helperText={errors.title?.message}
            label="Tytuł*"
            {...register("title", {
              required: {
                value: true,
                message: "Pole jest wymagane",
              },
              maxLength: {
                value: 100,
                message: "Tytuł może mieć maksymalnie 100 znaków",
              },
            })}
            sx={{ my: 2, width: "100%" }}
          />
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
            sx={{ height: 150 }}
          />
          <Controller
            name="description"
            control={control}
            defaultValue={""}
            rules={{
              validate: (value) =>
                value.length > 10 || "To pole jest obowiązkowe.",
            }}
            render={({ field, fieldState }) => (
              <div style={{ marginTop: "16px" }}>
                <ReactQuill
                  className={"small-quill"}
                  theme="snow"
                  value={field.value}
                  modules={modules}
                  onChange={(value) => {
                    setValue("description", value); // Update the value in react-hook-form
                    field.onChange(value); // Update the value for React-Quill
                  }}
                />
              </div>
            )}
          />
          {!!errors && errors.description?.message && (
            <Typography
              variant="body2"
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.error.main,
                ml: "14px",
              }}
            >
              {errors.description.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Anuluj</Button>
          <Button
            variant="contained"
            type="submit"
            sx={{ color: (theme) => theme.palette.text.light }}
          >
            Zapisz
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePost;

type myProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};
