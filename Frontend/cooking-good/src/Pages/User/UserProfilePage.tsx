import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TUser } from "../../types/user/TUser";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { showStatus } from "../Admin/Users/UsersPage";
import UpdateUserImage from "../../Components/User/UpdateUserImage";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import UpdateUserDescription from "../../Components/User/UpdateUserDescription";
import RecipeList from "../../Components/Recipes/Recipe/RecipeList";
import DescriptionIcon from "@mui/icons-material/Description";
import ShoppingList from "../../Components/User/ShoppingList";

const UserProfilePage = () => {
  const theme = useTheme();
  const { userId } = useParams();
  const auth = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<TUser>();

  const [openImage, setOpenImage] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);

  const [openShoppingList, setOpenShoppingList] = useState<boolean>(false);
  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    const response = await axios.get(`http://localhost:8080/users/${userId}`);
    if (response) {
      console.log(response.data.user);
      setUser(response.data.user);
    }
  };

  const handleSaveUserImage = async (formData: FormData) => {
    const res = await axios.put(
      `http://localhost:8080/users/image/${user?.id}`,
      formData,
      { headers: { Authorization: "Bearer " + auth.token } }
    );
    if (res.statusText === "OK") {
      setUser(res.data.user);
    }
  };

  const handleSaveUserDescription = async (data: Inputs) => {
    const res = await axios.put(
      `http://localhost:8080/users/description/${auth?.user?.userId}`,
      data,
      { headers: { Authorization: "Bearer " + auth.token } }
    );
    if (res.statusText === "OK") {
      setUser(res.data.user);
    }
  };

  const handleDeleteFromShoppingList = async (ingredients: string[]) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/users/shopping-list/${auth?.user?.userId}`,
        {
          data: {
            ingredients: ingredients,
          },
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadShoppingList = async () => {
    if (!!auth.user && auth.user.userId === user?.id)
      axios({
        url: `http://localhost:8080/users/shopping-list/download/${auth.user.userId}`,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Lista_zakupów.pdf`);
        document.body.appendChild(link);
        link.click();
      });
  };

  console.log(auth?.user?.userId === userId);
  console.log(user);

  return (
    <>
      {!!user && (
        <>
          <UpdateUserImage
            open={openImage}
            onClose={() => setOpenImage(false)}
            onSave={handleSaveUserImage}
          />
          <UpdateUserDescription
            open={openDescription}
            onClose={() => setOpenDescription(false)}
            onSave={handleSaveUserDescription}
            description={user.description}
          />
          <ShoppingList
            open={openShoppingList}
            user={user}
            onClose={() => {
              setOpenShoppingList(false);
            }}
            onDelete={(ingredients) =>
              handleDeleteFromShoppingList(ingredients)
            }
            onDownload={handleDownloadShoppingList}
          />
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              p: 4,
              backgroundImage: `url(http://localhost:8080/uploads/images/user-background.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            spacing={6}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={3}
              sx={{
                py: 2,
                px: 3,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(2px)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <>
                    {auth.user && user.id === auth.user.userId && (
                      <Stack
                        justifyContent="start"
                        alignItems="start"
                        sx={{ width: 80 }}
                      >
                        <IconButton
                          sx={{
                            background: "#cccccc",
                            alignSelf: "end",
                            "&:hover": { background: "#999" },
                          }}
                          onClick={() => setOpenImage(true)}
                        >
                          <AddAPhotoIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            background: "#cccccc",
                            "&:hover": { background: "#999" },
                          }}
                          onClick={() => setOpenDescription(true)}
                        >
                          <DriveFileRenameOutlineIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </>
                }
              >
                <Avatar
                  sx={{ width: 200, height: 200, border: "2px solid #999" }}
                  src={
                    user.image
                      ? `http://localhost:8080/${user.image.replace("\\", "/")}`
                      : ""
                  }
                />
              </Badge>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    color: (theme) => theme.palette.text.light,
                  }}
                >
                  {user.name}
                </Typography>
                {!!auth &&
                auth.user?.userId === user.id &&
                user.status === "blocked"
                  ? showStatus(user.status, { fontWeight: "bold" })
                  : null}
                {!!auth && auth.user?.userId === user.id && (
                  <Button
                    onClick={() => setOpenShoppingList(true)}
                    variant="contained"
                    sx={{
                      mt: 2,
                      color: (theme) => theme.palette.text.light,
                    }}
                    endIcon={<DescriptionIcon />}
                  >
                    Pokaż listę zakupów
                  </Button>
                )}
              </Box>
            </Stack>
          </Stack>

          <Container sx={{ py: 5 }}>
            {user.description && (
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 8,
                  background: (theme) => theme.palette.background.darker,
                }}
              >
                <Typography
                  sx={{
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  {user.description}
                </Typography>
              </Box>
            )}

            <RecipeList
              divider
              title="Przepisy"
              recipes={user.recipes}
              emptyStateMessage={`Użytkownik ${user.name} nie dodał jeszcze żadnych przepisów.`}
            />

            {auth?.user?.userId === userId && user.favorites?.length > 0 && (
              <RecipeList
                sx={{ mt: 4 }}
                divider
                title="Ulubione"
                recipes={user.favorites}
                emptyStateMessage={`Użytkownik ${user.name} nie dodał jeszcze żadnych przepisów.`}
              />
            )}
          </Container>
        </>
      )}
    </>
  );
};

export default UserProfilePage;

type Inputs = {
  description: string | undefined;
};
