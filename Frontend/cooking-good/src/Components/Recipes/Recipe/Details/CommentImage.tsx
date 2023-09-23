import styled from "styled-components";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";

const Image = styled(Box)`
  width: 100%;
  height: 220px;
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
  height: 20%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  transition: height 0.3s;
`;
const CommentImage = ({ commentImage, onDelete }: myProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <Image
      sx={{
        backgroundImage: `url(http://localhost:8080/${commentImage.image.replace(
          "\\",
          "/"
        )})`,
      }}
    >
      <Stack alignItems="flex-end">
        {!!user && user.userId === commentImage.creator.id && (
          <IconButton onClick={onDelete}>
            <DeleteForeverIcon
              sx={{ color: (theme) => theme.palette.text.light }}
            />
          </IconButton>
        )}
      </Stack>
      <InfoBox sx={{ p: 1 }}>
        <Typography
          sx={{
            height: 64,
            color: (theme) => theme.palette.text.light,
            textShadow: (theme) => `0 0 5px ${theme.palette.text.dark}`,
          }}
          variant="h6"
        >
          {commentImage.creator.name}
        </Typography>
      </InfoBox>
    </Image>
  );
};
export default CommentImage;
type myProps = {
  commentImage: { image: string; creator: any; addedAt: Date; id: string };
  onDelete: () => void;
};
