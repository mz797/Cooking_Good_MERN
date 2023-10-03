import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
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
import RateDialog from "../../Components/Recipes/Recipe/Details/RateDialog";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { RouterLink } from "../../Components/Navigation";
import { useForm } from "react-hook-form";
import Comment from "../../Components/Recipes/Recipe/Details/Comment";
import RecipeImage from "../../Components/Recipes/Recipe/RecipeImage";
import LoginDialog from "../../Components/Auth/LoginDialog";
import StarIcon from "@mui/icons-material/Star";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddPhotoDialog from "../../Components/Recipes/Recipe/AddPhotoDialog";
import CommentImage from "../../Components/Recipes/Recipe/Details/CommentImage";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { Masonry } from "@mui/lab";
import StepByStep from "../../Components/Recipes/Recipe/StepByStep";
import { useNotification } from "../../hooks/notification-hook";

type CommentType = {
  content: string;
  id: string;
};

const IconButton = styled(Button)(({ theme }) => ({
  margin: 1,
  background: theme.palette.background.darker,
}));

const RecipeDetailsPage = () => {
  const { displayNotification } = useNotification();
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeType | null>();
  const [openRateDialog, setOpenRateDialog] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [loginDialogContent, setLoginDialogContent] = useState<string>("");
  const [likeIsLoading, setLikeIsLoading] = useState<boolean>(false);
  const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);
  const [openStepByStep, setOpenStepByStep] = useState<boolean>(false);

  const [selectedIngredients, setSelectedIngredients] = useState<
    { name: string; amount: string }[] | []
  >([]);

  const [openAddPhoto, setOpenAddPhoto] = useState<boolean>(false);

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
  }, [id]);

  const handleDeleteRecipe = async () => {
    axios
      .delete(`http://localhost:8080/recipe/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        navigate("/");
        displayNotification({
          message: `Usunięto przepis.`,
          type: "success",
          open: true,
        });
      })
      .catch((err) => {
        displayNotification({
          message: `Nie udało się usunąć przepisu.`,
          type: "error",
          open: true,
        });
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
      setLikeIsLoading(true);
      axios
        .get(`http://localhost:8080/users/add-favorite/${user.userId}/${id}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setRecipe(res.data.recipe);
          console.log(res);
          setLikeIsLoading(false);
          displayNotification({
            message: `Dodano przepis '${res.data.recipe?.name}' do ulubionych`,
            type: "success",
            open: true,
          });
        })
        .catch((err) => {
          displayNotification({
            message: `Nie udało się dodać przepisu do ulubionych`,
            type: "error",
            open: true,
          });
          setLikeIsLoading(false);
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
      setLikeIsLoading(true);
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
          setLikeIsLoading(false);
          displayNotification({
            message: `Usunięto przepis '${res.data.recipe?.name}' z ulubionych`,
            type: "success",
            open: true,
          });
        })
        .catch((err) => {
          displayNotification({
            message: `Nie udało się usunąć przepisu z ulubionych`,
            type: "error",
            open: true,
          });
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
      displayNotification({
        message: `Dodano ocenę do przepisu '${response.data.recipe.name}'.`,
        type: "success",
        open: true,
      });
    } catch (err) {
      displayNotification({
        message: `Nie udało się dodać oceny do przepisu.`,
        type: "error",
        open: true,
      });
      console.log(err);
    }
  };

  const onCommentSubmit = async (data: CommentType) => {
    if (!token) {
      setLoginDialogContent(
        "Jedynie zalogowani użytkownicy mogą dodać komentarz."
      );
      setLoginDialogOpen(true);
      return;
    }
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
      displayNotification({
        message: `Dodano komentarz do przepisu.`,
        type: "success",
        open: true,
      });
    } catch (err) {
      displayNotification({
        message: `Nie udało się dodać komentarza do przepisu.`,
        type: "error",
        open: true,
      });
      console.log(err);
    }
  };

  const handleDownload = () => {
    if (!recipe) return;
    setPdfIsLoading(true);
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
      setPdfIsLoading(false);
    });
  };

  const handleSaveCommentImage = async (formData: FormData) => {
    try {
      if (user) {
        formData.append("creator", user.userId);
      }
      const res = await axios.put(
        `http://localhost:8080/recipe/comment-image/${recipe?.id}`,
        formData,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (res.statusText === "OK") {
        setRecipe(res.data.recipe);
        displayNotification({
          message: `Dodano zdjęcie do przepisu '${res.data.recipe?.name}'.`,
          type: "success",
          open: true,
        });
      }
    } catch (err) {
      displayNotification({
        message: `Nie udało się dodać zdjęcia do przepisu.`,
        type: "error",
        open: true,
      });
    }
  };
  const handleImageDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/recipe/comment-image/${recipe?.id}/${id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (res.statusText === "OK") {
        setRecipe(res.data.recipe);
        displayNotification({
          message: `Usunięto zdjęcie z przepisu '${res.data.recipe?.name}'.`,
          type: "success",
          open: true,
        });
      }
    } catch (err) {
      displayNotification({
        message: `Nie udało się usunąć zdjęcia z przepisu.`,
        type: "error",
        open: true,
      });
    }
  };

  const handleOpenAddImage = () => {
    if (!token) {
      setLoginDialogContent(
        "Jedynie zalogowani użytkownicy mogą dodać zdjęcie."
      );
      setLoginDialogOpen(true);
      return;
    }
    setOpenAddPhoto(true);
  };

  const handleAddIngredients = async () => {
    if (!token) {
      setLoginDialogContent(
        "Jedynie zalogowani użytkownicy mogą dodać składniki do listy zakupów."
      );
      setLoginDialogOpen(true);
      return;
    }
    //shopping-list
    else {
      try {
        const response = await axios.put(
          `http://localhost:8080/users/shopping-list/${user?.userId}`,
          {
            ingredients: selectedIngredients,
          },
          { headers: { Authorization: "Bearer " + token } }
        );
        if (response.status === 200) {
          setSelectedIngredients([]);
          displayNotification({
            message: `Dodano składniki do listy zakupów.`,
            type: "success",
            open: true,
          });
        }
      } catch (err) {
        displayNotification({
          message: `Nie udało się dodać składników do listy zakupów.`,
          type: "error",
          open: true,
        });
        console.log(err);
      }
    }
  };

  const handleIngredientSelect = (ingredient: {
    name: string;
    amount: string;
  }) => {
    if (
      selectedIngredients.find(
        (ing) =>
          ing.name === ingredient.name && ing.amount === ingredient.amount
      )
    ) {
      setSelectedIngredients((prev) =>
        prev.filter(
          (ing) =>
            !(ing.name === ingredient.name && ing.amount === ingredient.amount)
        )
      );
    } else {
      setSelectedIngredients((prev) => [...prev, ingredient]);
    }
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
        {recipe && (
          <StepByStep
            recipe={recipe}
            open={openStepByStep}
            onClose={() => setOpenStepByStep(false)}
          />
        )}
        <AddPhotoDialog
          open={openAddPhoto}
          onSave={handleSaveCommentImage}
          onClose={() => setOpenAddPhoto(false)}
        />
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
                  {pdfIsLoading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : (
                    <PictureAsPdfIcon />
                  )}
                </IconButton>
                <IconButton onClick={handleOpenRate}>
                  <StarIcon />
                </IconButton>
                <IconButton
                  onClick={
                    !!user &&
                    recipe.likes.some((like) => like.creator === user.userId)
                      ? handleDeleteFavorite
                      : handleFavorite
                  }
                >
                  {likeIsLoading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : !!user &&
                    recipe.likes.some(
                      (like) => like.creator === user.userId
                    ) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Stack>
            </Stack>
            <Box
              sx={{
                my: 3,
                width: "100%",
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
              <Grid item xs={12} md={5.5}>
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
                    <Box key={index}>
                      <ListItem key={index} sx={{ p: 0 }}>
                        <ListItemButton
                          onClick={() =>
                            handleIngredientSelect({
                              name: i.name,
                              amount: i.amount,
                            })
                          }
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={
                                !!selectedIngredients.find(
                                  (ing) => ing.name === i.name
                                )
                              }
                            />
                          </ListItemIcon>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              px: 1,
                              py: 0.25,
                              width: "100%",
                            }}
                            key={index}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: 16, sm: 20 },
                                textTransform: "uppercase",
                                letterSpacing: { sm: 1 },
                                maxWidth: "70%",
                              }}
                            >
                              {i.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: 16, sm: 20 },
                                maxWidth: "30%",
                                textAlign: "end",
                              }}
                            >
                              {i.amount}
                            </Typography>
                          </Stack>
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                  <Stack alignItems="center">
                    <Button
                      onClick={handleAddIngredients}
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
                <Paper
                  sx={{
                    my: 1,
                    p: 2,
                    background: (theme) => theme.palette.background.darker,
                  }}
                >
                  <Stack alignItems="center">
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                      Udało Ci się odtworzyć przepis? Pochwal się!
                    </Typography>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 1,
                        color: (theme) => theme.palette.text.light,
                      }}
                      endIcon={<AddPhotoAlternateIcon />}
                      onClick={handleOpenAddImage}
                    >
                      Dodaj zdjęcie
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                    }}
                  >
                    Przepis
                  </Typography>
                  {recipe.description.length > 1 && (
                    <Button
                      variant={"contained"}
                      endIcon={<LocalActivityIcon />}
                      onClick={() => setOpenStepByStep(true)}
                      sx={{ color: (theme) => theme.palette.text.light }}
                    >
                      Krok po Kroku
                    </Button>
                  )}
                </Stack>
                {recipe.description.map((desc, idx) => (
                  <Box key={idx}>
                    {recipe.description.length > 1 && (
                      <Typography variant="h5">Krok {idx + 1}</Typography>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: desc.content,
                      }}
                    />
                  </Box>
                ))}
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
                key={c.id}
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
        <>
          {recipe.commentImages.length > 0 && (
            <Container sx={{ py: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  py: 2,
                  textAlign: "center",
                }}
              >{`Wasze zdjęcia(${recipe.commentImages.length})`}</Typography>
              <Masonry columns={{ xs: 1, sm: 2, md: 3 }}>
                {recipe.commentImages.map((comment, index) => (
                  <Box key={comment.id}>
                    <CommentImage
                      commentImage={comment}
                      onDelete={() => handleImageDelete(comment.id)}
                    />
                  </Box>
                ))}
              </Masonry>
            </Container>
          )}
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
        </>
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
