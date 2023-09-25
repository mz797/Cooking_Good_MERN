import { Button, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
type myProps = {
  register: any;
  errors: any;
  setValue: any;
  control: any;
  description: any;
  handleAddDescription: () => void;
  handleRemoveDescription: (val: number) => void;
};
const AddRecipeDescription = ({
  register,
  errors,
  setValue,
  control,
  description,
  handleAddDescription,
  handleRemoveDescription,
}: myProps) => {
  console.log("description", description);
  const [recipeInSteps, setRecipeInSteps] = useState<boolean>(
    description.length !== 1
  );

  const handleAddStep = () => {
    handleAddDescription();
  };

  const handleRemoveStep = () => {
    if (description.length === 2) {
      setRecipeInSteps(false);
    }
    handleRemoveDescription(description.length - 1);
  };
  const handleTrigerRecipeType = () => {
    setRecipeInSteps(true);
    handleAddDescription();
  };

  useEffect(() => {
    register("description", {
      required: {
        value: true,
        message: "Podaj opis.",
      },
    });
  }, []);
  return (
    <>
      <Stack direction="row" justifyContent="end" spacing={2} sx={{ mb: 1 }}>
        {description.length > 1 && (
          <Button variant="contained" onClick={handleRemoveStep}>
            Usuń ostatni krok
          </Button>
        )}
        <Button
          variant="contained"
          onClick={recipeInSteps ? handleAddStep : handleTrigerRecipeType}
        >
          {recipeInSteps ? "Dodaj krok" : "Stwórz przepis w krokach"}
        </Button>
      </Stack>
      {description.map((step: any, idx: number) => (
        <Grid container sx={{ mb: 6, width: "100%" }} key={step.id}>
          <Grid item xs={12}>
            <Controller
              name={`description[${idx}].content`} // Użyj indeksu do indeksowania tablicy
              control={control}
              defaultValue={step.content}
              rules={{
                validate: (value) =>
                  value.length > 10 || "To pole jest obowiązkowe.",
              }}
              render={({ field, fieldState }) => (
                <div>
                  <ReactQuill
                    className={recipeInSteps ? "super-small-quill" : "quill"}
                    theme="snow"
                    value={field.value}
                    modules={modules}
                    onChange={(value) => {
                      setValue(`description[${idx}].content`, value); // Zaktualizuj wartość w react-hook-form
                      field.onChange(value); // Zaktualizuj wartość dla React-Quill
                    }}
                  />
                </div>
              )}
            />
            {!!errors &&
              errors.description &&
              errors.description[idx]?.content?.message && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 12,
                    color: (theme) => theme.palette.error.main,
                    ml: "14px",
                  }}
                >
                  {errors.description[idx]?.content?.message}
                </Typography>
              )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default AddRecipeDescription;
