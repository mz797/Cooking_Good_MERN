import { Box, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import RecipeDifficulty from "./RecipeDifficulty";

import RecipeTime from "./RecipeTime";
import PersonCount from "./PersonCount";
import StarsRating from "../../common/StarsRating";
import { RecipeType } from "../../../types/recipe-types";
import ViewsAndLikes from "./ViewsAndLikes";

const Image = styled(Box)`
  width: 100%;
  height: 320px;
  background-position: center;
  background-size: cover;
  transition: transform 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const InfoBox = styled(Box)`
  width: 100%;
  height: 39%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  transition: height 0.3s;
`;
const RecipeImage = ({
  recipe,
  showName = true,
  imageStyle,
  infoStyle,
}: myProps) => {
  return (
    <Image
      sx={{
        backgroundImage: `url(http://localhost:8080/${recipe.image.replace(
          "\\",
          "/"
        )})`,
        ...imageStyle,
      }}
    >
      <ViewsAndLikes
        sx={{ alignSelf: "end" }}
        views={recipe.visitCount}
        likes={recipe.likes.length}
      />
      <InfoBox sx={{ p: 1, ...infoStyle }}>
        {showName && (
          <Typography
            sx={{
              height: 64,
              textShadow: (theme) => `0 0 5px ${theme.palette.text.dark}`,
            }}
            variant="h6"
          >
            {recipe.name}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={{ xs: 1, lg: 2 }}
          justifyContent="space-between"
        >
          <RecipeTime time={recipe.time} />
          <RecipeDifficulty difficulty={recipe.difficulty} />
          <PersonCount
            count={recipe.personCount}
            styles={{
              display: {
                xs: "flex",
                sm: "none",
                lg: "flex",
              },
            }}
          />
          <StarsRating rates={recipe.rates} />
        </Stack>
      </InfoBox>
    </Image>
  );
};

export default RecipeImage;

type myProps = {
  recipe: RecipeType;
  showName?: boolean;
  imageStyle?: object;
  infoStyle?: object;
};
