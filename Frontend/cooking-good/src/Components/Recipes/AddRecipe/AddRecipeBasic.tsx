import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Controller } from "react-hook-form";
import ImageUpload from "../../common/ImageUpload";
import { useEffect } from "react";
import { ICategory } from "../../../types/category-types";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { loadCategories } from "../../../store/actions/CategoryActions";

export const difficultyMarks = [
  {
    value: 1,
    label: "Łatwy",
  },
  {
    value: 2,
    label: "Średni",
  },
  {
    value: 3,
    label: "Trudny",
  },
];
export const timeMarks = [
  {
    value: 1,
    label: "15 min",
  },
  {
    value: 2,
    label: "30 min",
  },
  {
    value: 3,
    label: "45 min",
  },
  {
    value: 4,
    label: "1 h",
  },
  {
    value: 5,
    label: "1,5 h",
  },
  {
    value: 6,
    label: "2 h",
  },
  {
    value: 7,
    label: "2,5 h",
  },
  {
    value: 8,
    label: "3h +",
  },
];

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const AddRecipeBasic = ({
  register,
  editMode,
  control,
  watch,
  errors,
  setValue,
}: any) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) =>
    state.categories.categoryList.map((category: ICategory) => ({
      id: category.id,
      name: category.name,
    }))
  );

  useEffect(() => {
    dispatch(loadCategories());
  }, []);

  const selectedImageHandler = (file: File | undefined) => {
    setValue("image", file);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
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
              message: "Nazwa może mieć maksymalnie 50 znaków",
            },
          })}
          sx={{ mb: 2 }}
        />
        <StyledTextField
          multiline
          rows={2}
          error={!!errors.shortDescription}
          helperText={errors.shortDescription?.message}
          label="Krótki opis*"
          {...register("shortDescription", {
            required: {
              value: true,
              message: "Pole jest wymagane",
            },
            maxLength: {
              value: 250,
              message: "Krótki opis może mieć maksymalnie 250 znaków",
            },
          })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="demo-simple-select-label">Ilość osób</InputLabel>
          <Select
            label="Ilość osób*"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={watch("personCount")}
            {...register("personCount", {
              required: {
                value: true,
                message: "Pole jest wymagane",
              },
            })}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <MenuItem key={index} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
          {!!errors?.personCount?.message && (
            <FormHelperText>{errors.personCount.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={4} sx={{ pb: 2 }}>
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
          defaultValue={!!editMode && watch("image")}
          onInput={selectedImageHandler}
          error={!!errors.image}
          helperText={errors.image?.message}
        />
      </Grid>
      <Grid item xs={12} sx={{ mx: 2 }}>
        <FormLabel>Czas przygotowania*</FormLabel>
        <Slider
          {...register("time", { valueAsNumber: true })}
          value={watch("time") || 1}
          step={1}
          marks={timeMarks}
          min={1}
          max={timeMarks.length}
        />
      </Grid>
      <Grid item xs={12} sx={{ mx: 2 }}>
        <FormLabel>Poziom trudności*</FormLabel>
        <Slider
          {...register("difficulty", { valueAsNumber: true })}
          value={watch("difficulty") || 1}
          step={1}
          marks={difficultyMarks}
          min={1}
          max={difficultyMarks.length}
        />
      </Grid>
      <Grid item>
        <Typography
          sx={{
            color: (theme) => errors?.categories && theme.palette.error.main,
          }}
        >
          Kategorie*:
        </Typography>
        {categories.map((c) => (
          <FormControlLabel
            key={c.id}
            control={
              <Controller
                name="categories"
                control={control}
                defaultValue={false}
                rules={{
                  validate: (value) =>
                    value.length > 0 || "Wybierz conajmniej 1 kategorię", // Validate at least one category is selected
                }}
                render={({ field }) => (
                  <Checkbox
                    name={c.name}
                    checked={field.value.some(
                      (value: any) => value.id === c.id
                    )}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        field.onChange([...field.value, c]);
                      } else {
                        field.onChange(
                          field.value.filter((value: any) => value.id !== c.id)
                        );
                      }
                    }}
                  />
                )}
              />
            }
            label={c.name}
          />
        ))}
        {!!errors?.categories?.message && (
          <Typography
            variant="body2"
            sx={{
              fontSize: 12,
              color: (theme) => theme.palette.error.main,
              ml: "14px",
            }}
          >
            {errors.categories.message}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default AddRecipeBasic;
