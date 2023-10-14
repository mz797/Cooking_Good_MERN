import {
  AppBar,
  Avatar,
  Button,
  Container,
  Divider,
  Menu,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ModeSwitch from "./ModeSwitch";

export const RouterLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.text.light,
  textDecoration: "none",
  fontSize: 18,
  transition: "0.3s",
}));
const MenuLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.text.dark,
  textDecoration: "none",
  fontSize: 18,
  transition: "0.3s",
}));

const Navigation = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [adminAnchorEl, setAdminAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [userAnchorEl, setUserAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const adminOpen = Boolean(adminAnchorEl);
  const userOpen = Boolean(userAnchorEl);
  const handleAdminClick = (event: React.MouseEvent<HTMLElement>) => {
    setAdminAnchorEl(event.currentTarget);
  };
  const handleAdminClose = () => {
    setAdminAnchorEl(null);
  };
  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };
  const handleUserClose = () => {
    setUserAnchorEl(null);
  };
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  return (
    <AppBar
      position="static"
      sx={{ background: (theme) => theme.color.header }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CookieIcon
              fontSize="large"
              sx={{
                color: (theme) => theme.palette.text.light,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Dancing Script, cursive",
                m: 0,
                alignItems: "flex-end",
                color: (theme) => theme.palette.text.light,
              }}
            >
              Cookinng Good
            </Typography>
          </Stack>
          <Stack spacing={3} direction="row" alignItems="center">
            <RouterLink to="/recipes">Przepisy</RouterLink>
            <RouterLink to="/posts">Ciekawostki</RouterLink>

            {!token && (
              <>
                <RouterLink to="/auth/login">Zaloguj się</RouterLink>
                <RouterLink to="/auth/signup">Zarejestruj się</RouterLink>
              </>
            )}
            {token && (
              <>
                <Button
                  sx={{
                    color: (theme) => theme.palette.text.light,
                    fontSize: 18,
                    textTransform: "capitalize",
                  }}
                  onClick={handleAdminClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Zarządzaj
                </Button>
                <Menu
                  open={adminOpen}
                  anchorEl={adminAnchorEl}
                  onClose={handleAdminClose}
                  onClick={handleAdminClose}
                >
                  <MenuItem component={MenuLink} to="/categories">
                    Kategorie
                  </MenuItem>
                  <MenuItem component={MenuLink} to="/reports">
                    Zgłoszenia
                  </MenuItem>
                  <MenuItem component={MenuLink} to="/users">
                    Użytkownicy
                  </MenuItem>
                </Menu>

                <Button
                  sx={{
                    color: (theme) => theme.palette.text.light,
                    textTransform: "capitalize",
                  }}
                  onClick={handleUserClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      alt={user?.name}
                      src={
                        user?.image
                          ? `http://localhost:8080/${user?.image.replace(
                              "\\",
                              "/"
                            )}`
                          : ""
                      }
                    />
                    <Typography sx={{ fontSize: 18 }}> {user?.name}</Typography>
                  </Stack>
                </Button>
                <Menu
                  open={userOpen}
                  anchorEl={userAnchorEl}
                  onClose={handleUserClose}
                  onClick={handleUserClose}
                >
                  <MenuItem component={MenuLink} to="/add-recipe">
                    Dodaj przepis
                  </MenuItem>
                  <MenuItem
                    component={MenuLink}
                    to={`/user-profile/${user?.userId}`}
                  >
                    Panel użytkownika
                  </MenuItem>

                  <MenuItem component={MenuLink} to="/planner">
                    Planer
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <Button
                      onClick={handleLogout}
                      sx={{
                        p: 0,
                        m: 0,
                        color: (theme) => theme.palette.text.dark,
                        fontSize: 16,
                        textTransform: "capitalize",
                      }}
                    >
                      Wyloguj się
                    </Button>
                  </MenuItem>
                </Menu>
              </>
            )}
            <ModeSwitch />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
