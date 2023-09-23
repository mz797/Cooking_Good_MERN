import { Chip, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ViewsAndLikes = ({ views, likes, sx }: myProps) => {
  return (
    <Chip
      variant="outlined"
      sx={{ m: 1, background: "rgba(0, 0, 0, 0.4)", ...sx }}
      label={
        <Stack
          direction="row"
          spacing={2}
          sx={{
            color: (theme) => theme.palette.text.light,
            textShadow: (theme) => `0 0 5px ${theme.palette.text.dark}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <VisibilityIcon />
            <Typography>{views}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <FavoriteIcon />
            <Typography>{likes}</Typography>
          </Stack>
        </Stack>
      }
    />
  );
};
export default ViewsAndLikes;

type myProps = {
  views: number;
  likes: number;
  sx: object;
};
