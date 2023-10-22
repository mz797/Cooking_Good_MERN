import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import React, { useEffect, useState } from "react";
import { RecipeType } from "../../types/recipe-types";
import RecipeList from "../../Components/Recipes/Recipe/RecipeList";
import axios from "axios";
import {
  addErrorNotification,
  addSuccessNotification,
} from "../../store/reducers/notificationReducer";
import { loadPlanner } from "../../store/reducers/PlannerReducer";
import { LoadingButton } from "@mui/lab";

const PlannerDetails = () => {
  const { date } = useParams();
  console.log(date);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const planner = useAppSelector((state) => state.planner.planner);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const myPlan = planner.find((plan) => plan.date === date);
    if (!!myPlan) setRecipes(myPlan.recipes);
  }, [date, planner]);

  const handleDelete = async (recipeId: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/users/planner/${auth?.user?.userId}/${recipeId}/${date}`
      );
      if (res.status === 200) {
        dispatch(loadPlanner({ planner: res.data.planner }));
        dispatch(
          addSuccessNotification({ message: "Usunięto przepis z planera." })
        );
      }
    } catch (err) {
      dispatch(
        addErrorNotification({
          message: "Nie udało się usunąć przepisu z planera.",
        })
      );
    }
  };

  const handleDownload = () => {
    ///planner/download/:userId/:date
    setPdfIsLoading(true);
    axios({
      url: `http://localhost:8080/users/planner/download/${auth?.user?.userId}/${date}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Jadłospis_${date}.pdf`);
      document.body.appendChild(link);
      link.click();
      setPdfIsLoading(false);
    });
  };
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc( 100vh - 64px )",
        background: (theme) => theme.palette.background.darker,
      }}
    >
      <Container sx={{ py: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <Typography
            variant="h4"
            sx={{
              textAlign: "start",
              color: (theme) => theme.palette.primary.main,
            }}
          >
            Plan dnia {date?.replaceAll("-", ".")}
          </Typography>
          <LoadingButton
            loading={pdfIsLoading}
            variant="contained"
            sx={{ color: (theme) => theme.palette.text.light }}
            onClick={handleDownload}
          >
            Pobierz potrzebne składniki
          </LoadingButton>
        </Stack>
        <Divider sx={{ my: 4 }} />
        <RecipeList
          onDelete={handleDelete}
          recipes={recipes}
          emptyStateMessage={`Brak zaplanowanych dań.`}
          titleStyles={{ my: 4 }}
        />
        {/*<Divider sx={{ my: 2 }} />*/}
      </Container>
    </Box>
  );
};
export default PlannerDetails;
