import OAuth2Login from "react-simple-oauth2-login";
import axios from "axios";
import { useNotification } from "../../hooks/notification-hook";
import { login } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Box } from "@mui/material";

const FacebookAuth = () => {
  const dispatch = useDispatch();
  const { displayNotification } = useNotification();
  const navigate = useNavigate();
  const ref = useRef();
  const onSuccess = async (res: any) => {
    const accessToken = res.access_token;
    const result = await fetch(
      `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`
    );
    const profile = await result.json();

    console.log(profile);
    const { id, name }: { id: string; name: string } = profile;
    let loginRes: any;
    try {
      loginRes = await axios.post(
        "http://localhost:8080/users/facebook/login",
        {
          id,
          name,
        }
      );
    } catch (err: any) {
      if (err.response) {
        displayNotification({
          message: err.response.data.message,
          type: "error",
          open: true,
        });
      } else {
        displayNotification({
          message: "Wystąpił błąd logowania",
          type: "error",
          open: true,
        });
      }
      return;
    }
    if (loginRes.status === 200 || loginRes.status === 201) {
      dispatch(login({ user: loginRes.data.user, token: loginRes.data.token }));
      navigate("/");
    }
  };
  const onFailure = (res: any) => {
    console.log(res);
  };
  return (
    <Box sx={{ mt: 2 }}>
      <OAuth2Login
        buttonText="Facebook"
        authorizationUrl="https://www.facebook.com/dialog/oauth"
        responseType="token"
        clientId="351655907309411"
        redirectUri="http://localhost:3000/auth/login"
        scope="public_profile"
        onSuccess={onSuccess}
        onFailure={onFailure}
        className="facebook-button"
      />
    </Box>
  );
};
export default FacebookAuth;
