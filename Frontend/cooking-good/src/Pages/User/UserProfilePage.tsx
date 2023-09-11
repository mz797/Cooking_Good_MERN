import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Recipe from "../../Components/Recipes/Recipe/Recipe";
import { TUser } from "../../types/user/TUser";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { showStatus } from "../Admin/Users/UsersPage";
import UpdateUserImage from "../../Components/User/UpdateUserImage";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import UpdateUserDescription from "../../Components/User/UpdateUserDescription";
import EmptyState from "../../Components/common/EmptyState";

const UserProfilePage = () => {
  const theme = useTheme();
  const { userId } = useParams();
  const auth = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<TUser>();

  const [openImage, setOpenImage] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

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
      `http://localhost:8080/users/description/${user?.id}`,
      data,
      { headers: { Authorization: "Bearer " + auth.token } }
    );
    if (res.statusText === "OK") {
      setUser(res.data.user);
    }
  };

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
              spacing={2}
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
                  showStatus(user.status, { fontWeight: "bold" })}
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
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Przepisy
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              useFlexGap
              flexWrap="wrap"
            >
              {user.recipes.map((item) => (
                <Recipe key={item._id} recipe={item} />
              ))}
              {user.recipes.length === 0 && (
                <EmptyState
                  message={`Użytkownik ${user.name} nie dodał jeszcze żadnych przepisów.`}
                />
              )}
            </Stack>
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
