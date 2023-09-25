import { Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddRecipeBasic from "../../Components/Recipes/AddRecipe/AddRecipeBasic";
import AddRecipeIngredients from "../../Components/Recipes/AddRecipe/AddRecipeIngredients";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddRecipeDescription from "../../Components/Recipes/AddRecipe/AddRecipeDescription";
import SaveIcon from "@mui/icons-material/Save";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeType } from "../../types/recipe-types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type Inputs = {
  name: string;
  image: string;
  categories: { id: string; name: string }[];
  time: number;
  difficulty: number;
  personCount: number;
  ingredients: { name: string; amount: string }[];

  description: { content: string }[];
  shortDescription: string;
};
type myProps = {
  recipe?: RecipeType;
};
const AddRecipe = ({ recipe }: myProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [editedRecipe, setEditedRecipe] = useState<RecipeType | null>(null);

  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    if (param.id) {
      axios.get(`http://localhost:8080/recipe/${param.id}`).then((res) => {
        console.log(res.data.recipe);
        setEditedRecipe(res.data.recipe);
      });
    } else {
      setEditedRecipe(null);
    }
  }, [param.id]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: {
      name: editedRecipe ? editedRecipe.name : "",
      image: editedRecipe ? editedRecipe.image : "",
      categories: editedRecipe ? editedRecipe.categories : [],
      time: editedRecipe ? editedRecipe.time : 1,
      difficulty: editedRecipe ? editedRecipe.difficulty : 1,
      personCount: editedRecipe ? editedRecipe.personCount : 1,
      ingredients: editedRecipe
        ? editedRecipe.ingredients
        : [
            { name: "", amount: "" },
            { name: "", amount: "" },
          ],
      shortDescription: editedRecipe ? editedRecipe.shortDescription : "",
      description: editedRecipe ? editedRecipe.description : [{ content: "" }],
    },
  });
  useEffect(() => {
    if (editedRecipe) {
      setValue("name", editedRecipe.name);
      setValue("image", editedRecipe.image);
      setValue("categories", editedRecipe.categories);
      setValue("time", editedRecipe.time);
      setValue("difficulty", editedRecipe.difficulty);
      setValue("ingredients", editedRecipe.ingredients);
      setValue("description", editedRecipe.description);
      setValue("shortDescription", editedRecipe.shortDescription);
      setValue("personCount", editedRecipe.personCount);
      setValue("image", editedRecipe.image);
    } else {
      reset();
    }
  }, [editedRecipe]);

  const {
    fields: ingredientFields,
    append,
    remove,
  } = useFieldArray({
    name: "ingredients",
    control,
  });

  const {
    fields: descriptionFields,
    append: appendDesc,
    remove: removeDesc,
  } = useFieldArray({
    name: "description",
    control,
  });

  const [step, setStep] = useState<number>(1);

  const onSubmit = (data: Inputs) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append(
      "categories",
      JSON.stringify(data.categories.map((category) => category.id))
    );
    formData.append("description", JSON.stringify(data.description));
    formData.append("shortDescription", data.shortDescription);
    formData.append("difficulty", data.difficulty.toString());
    formData.append("image", data.image);
    formData.append("personCount", data.personCount.toString());
    formData.append("ingredients", JSON.stringify(data.ingredients));
    formData.append("time", data.time.toString());
    formData.append("creator", user ? user.userId : "");
    if (!editedRecipe) {
      fetch("http://localhost:8080/recipe", {
        method: "POST",
        body: formData,
        headers: { Authorization: "Bearer " + token },
      }).then((res) => {
        console.log(res);
        navigate("/");
      });
    } else {
      fetch(`http://localhost:8080/recipe/${param.id}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: "Bearer " + token },
      }).then((res) => {
        console.log(res);
        navigate("/");
      });
    }
  };
  const handleAddIngredient = () => {
    append({ name: "", amount: "" });
  };

  const handleRemoveIngredient = (idx: number) => {
    remove(idx);
  };

  const handleAddDescription = () => {
    appendDesc({ content: "" });
  };
  const handleRemoveDescription = (idx: number) => {
    removeDesc(idx);
  };
  const handleNextStep = () => {
    if (step === 1) {
      trigger(["name", "image", "categories"]).then((res) => {
        if (res) setStep((prev) => prev + 1);
      });
    } else if (step === 2) {
      trigger("ingredients").then((res) => {
        if (res) setStep((prev) => prev + 1);
      });
    } else
      trigger(["name", "image", "categories"]).then((res) => {
        if (res) setStep((prev) => prev + 1);
      });
  };
  const handlePrevtStep = () => {
    setStep((prev) => prev - 1);
  };
  console.log(watch("name"));

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="center" sx={{ mx: "auto" }}>
        <Grid item xs={12}>
          <Typography variant="h3" mb={4} sx={{ textAlign: "center" }}>
            Dodaj przepis
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ px: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <AddRecipeBasic
                setValue={setValue}
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                editMode={!!editedRecipe}
              />
            )}
            {step === 2 && (
              <AddRecipeIngredients
                register={register}
                ingredients={ingredientFields}
                append={handleAddIngredient}
                remove={handleRemoveIngredient}
                errors={errors}
              />
            )}
            {step === 3 && (
              <AddRecipeDescription
                control={control}
                description={descriptionFields}
                setValue={setValue}
                register={register}
                errors={errors}
                handleAddDescription={handleAddDescription}
                handleRemoveDescription={handleRemoveDescription}
              />
            )}
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {step > 1 && (
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handlePrevtStep}
                  startIcon={<ArrowBackIcon />}
                >
                  {"Cofnij "}
                </Button>
              )}
              {step < 3 && (
                <Button
                  variant="contained"
                  sx={{ mt: 2, color: (theme) => theme.palette.text.light }}
                  onClick={handleNextStep}
                  endIcon={<ArrowForwardIcon />}
                >
                  {"Dalej"}
                </Button>
              )}
              {step === 3 && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  type="submit"
                  endIcon={<SaveIcon />}
                >
                  Zapisz
                </Button>
              )}
            </Container>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddRecipe;
