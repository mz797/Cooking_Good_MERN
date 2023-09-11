import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RecipeType } from "../../types/recipe-types";
import { RootState } from "../../store/store";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import StarIcon from "@mui/icons-material/Star";
import RateDialog from "../../Components/Recipes/Recipe/RateDialog";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useForm } from "react-hook-form";
import Comment from "../../Components/Recipes/Recipe/Comment";
import RecipeImage from "../../Components/Recipes/Recipe/RecipeImage";
import { RouterLink } from "../../Components/Navigation";
import LoginDialog from "../../Components/Auth/LoginDialog";

type CommentType = {
  content: string;
  id: string;
};

const IconButton = styled(Button)(({ theme }) => ({
  margin: 1,
  background: theme.palette.background.darker,
}));

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeType | null>();
  const [openRateDialog, setOpenRateDialog] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [loginDialogContent, setLoginDialogContent] = useState<string>("");
  //
  // if (recipe && user) {
  //   console.log(recipe.likes.some((like) => like.creator === user.userId));
  // }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentType>({ mode: "onTouched" });

  useEffect(() => {
    axios.get(`http://localhost:8080/recipe/${id}`).then((res) => {
      setRecipe(res.data.recipe);
    });
  }, []);

  const handleDeleteRecipe = async () => {
    axios
      .delete(`http://localhost:8080/recipe/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        navigate("/");
      });
  };
  const handleEditRecipe = () => {
    navigate("/edit-recipe/" + id);
  };
  const handleOpenRate = () => {
    if (!!user) setOpenRateDialog(true);
    else {
      setLoginDialogContent(
        "Jedynie zalogowani użytkownicy mogą ocenić przepis."
      );
      setLoginDialogOpen(true);
    }
  };
  const handleFavorite = () => {
    if (!!user) {
      axios
        .get(`http://localhost:8080/users/add-favorite/${user.userId}/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setRecipe(res.data.recipe);
          console.log(res);
        });
    } else {
      setLoginDialogContent(
        "Jedynie zalogowani użytkownicy mogą dodać przepis do listy ulubionych."
      );
      setLoginDialogOpen(true);
    }
  };
  const handleDeleteFavorite = () => {
    if (!!user) {
      axios
        .get(
          `http://localhost:8080/users/delete-favorite/${user.userId}/${id}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => {
          setRecipe(res.data.recipe);
          console.log(res);
        });
    } else {
      setLoginDialogContent(
        "Jedynie zalogowani użytkownicy mogą dodać przepis do listy ulubionych."
      );
      setLoginDialogOpen(true);
    }
  };

  const handleRateSubmit = async (value: number) => {
    setOpenRateDialog(false);

    try {
      const response = await axios.put(
        `http://localhost:8080/recipe/rate/${id}`,
        { rate: { rate: value, creator: user?.userId } },

        { headers: { Authorization: "Bearer " + token } }
      );
      setRecipe(response.data.recipe);
    } catch (err) {
      console.log(err);
    }
  };

  const onCommentSubmit = async (data: CommentType) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/recipe/comment/${id}`,
        {
          comment: {
            content: data.content,
            creator: user?.userId,
            reports: [],
            addedAt: new Date(),
          },
        },
        { headers: { Authorization: "Bearer " + token } }
      );

      setRecipe(response.data.recipe);
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownload = () => {
    if (!recipe) return;
    axios({
      url: `http://localhost:8080/recipe/download/${id}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${recipe.name.split(" ").join("-")}.pdf`);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <>
      <Container sx={{ my: 4 }}>
        {!!recipe && openRateDialog && (
          <RateDialog
            open={openRateDialog}
            title={recipe.name}
            value={1}
            onSubmit={handleRateSubmit}
            onClose={() => setOpenRateDialog(false)}
          />
        )}
        <LoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          title="Zaloguj się"
          content={loginDialogContent}
        />
        {!recipe && <Typography>Nie ma takiego przepisu</Typography>}
        {recipe && (
          <>
            <Typography
              variant="h3"
              sx={{
                mb: 2.5,
                wordBreak: "break-word",
                fontWeight: 500,
                letterSpacing: 0.7,
              }}
            >
              {recipe.name}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ my: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  sx={{
                    border: "1px solid #999",
                  }}
                  src={
                    recipe.creator.image
                      ? `http://localhost:8080/${recipe.creator.image.replace(
                          "\\",
                          "/"
                        )}`
                      : ""
                  }
                />
                <Typography
                  component={Link}
                  to={`/user-profile/${recipe.creator.id}`}
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                  }}
                >
                  {recipe.creator.name}
                </Typography>
              </Stack>
              <Stack direction="row">
                {!!user && user.userId === recipe.creator.id && (
                  <Box>
                    <IconButton onClick={handleDeleteRecipe}>Usuń</IconButton>
                    <IconButton onClick={handleEditRecipe}>Edytuj</IconButton>
                  </Box>
                )}
                <IconButton onClick={handleDownload}>
                  <PictureAsPdfIcon />
                </IconButton>
                <IconButton onClick={handleOpenRate}>
                  <StarIcon />
                </IconButton>
                <IconButton>
                  {!!user &&
                  recipe.likes.some((like) => like.creator === user.userId) ? (
                    <FavoriteIcon
                      color="error"
                      onClick={handleDeleteFavorite}
                    />
                  ) : (
                    <FavoriteBorderIcon onClick={handleFavorite} />
                  )}
                </IconButton>
              </Stack>
            </Stack>
            <Box
              sx={{
                my: 3,
                width: "100%",
                height: "50vh",
                color: (theme) => theme.palette.text.light,
              }}
            >
              <RecipeImage
                recipe={recipe}
                showName={false}
                imageStyle={{ height: "50vh" }}
                infoStyle={{ height: "auto", px: 4 }}
              />
            </Box>
            <Box
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                p: 2,
                mb: 2,
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                {recipe.shortDescription}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Paper
                  sx={{
                    pb: 2,
                    background: (theme) => theme.palette.background.darker,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 1,
                      p: 1,
                      textAlign: "center",
                      color: (theme) => theme.palette.primary.main,
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.text.dark}`,
                    }}
                  >
                    Składniki
                  </Typography>
                  {recipe.ingredients.map((i, index) => (
                    <>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-end"
                        sx={{ px: 1, py: 0.25 }}
                        key={index}
                      >
                        <Typography
                          sx={{
                            fontSize: 20,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            maxWidth: "70%",
                          }}
                        >
                          {i.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 20,
                            maxWidth: "30%",
                            textAlign: "end",
                          }}
                        >
                          {i.amount}
                        </Typography>
                      </Box>
                      <Divider />
                    </>
                  ))}
                  <Stack alignItems="center">
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        color: (theme) => theme.palette.text.light,
                      }}
                      endIcon={<DescriptionIcon />}
                    >
                      Dodaj składniki do listy
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h4"
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                  }}
                >
                  Przepis
                </Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: recipe.description,
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      {!!recipe && recipe.categories && (
        <Box
          sx={{
            background: (theme) => theme.palette.background.darker,
          }}
        >
          <Container
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {recipe.categories.map((c) => (
              <Button
                component={RouterLink}
                to={"/category/" + c.id}
                sx={{
                  m: 1,
                  color: (theme) => theme.palette.text.light,
                  background: (theme) => theme.palette.background.gray,
                  "&:hover": {
                    background: (theme) => theme.palette.background.darkGray,
                  },
                }}
              >
                #{c.name}
              </Button>
            ))}
          </Container>
        </Box>
      )}
      {!!recipe && (
        <Container sx={{ py: 4 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >{`Komentarze(${recipe.comments.length})`}</Typography>
          <List>
            {recipe.comments.map((comment, index) => (
              <Box key={comment.id}>
                <Comment comment={comment} recipe={recipe} />
                {index !== recipe.comments.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
          <form
            onSubmit={handleSubmit(onCommentSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <TextField
              multiline
              rows={2}
              sx={{ width: "100%" }}
              label="Napisz komentarz"
              {...register("content")}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                color: (theme) => theme.palette.text.light,
              }}
            >
              Dodaj komentarz
            </Button>
          </form>
        </Container>
      )}
    </>
  );

  /* <Grid
                                                                                                      <Grid
                                                                                                      item
                                                                                                      xs={12}
                                                                                                      sx={{ mt: 2, borderTop: "1px solid #999" }}>
                                                                                                      <Stack direction="row" alignItems="center">
                                                                                                      <ChatIcon sx={{ mr: 2, fontSize: 32 }} />
                                                                                                      <Typography variant="h4">{`Komentarze(${recipe.comments.length})`}</Typography>
                                                                                                      </Stack>
                                                      
                                                                                                              </Grid>
                                                                                                          </Grid> */
};
export default RecipeDetailsPage;
const Image = styled(Box)`
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  transition: transform 0.3s;
  overflow: hidden;
  display: flex;
  align-items: end;
`;
