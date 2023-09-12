import { Grid, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const modules = {
  toolbar: [
    [{ header: [2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
};

const AddRecipeDescription = ({
  register,
  errors,
  setValue,
  control,
  description,
}: any) => {
  return (
    <Grid container sx={{ mb: 6, width: "100%" }}>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          defaultValue={description}
          rules={{
            validate: (value) =>
              value.length > 10 || "To pole jest obowiązkowe.",
          }}
          render={({ field, fieldState }) => (
            <div>
              <ReactQuill
                className={"quill"}
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
      </Grid>
    </Grid>
  );
};

export default AddRecipeDescription;
