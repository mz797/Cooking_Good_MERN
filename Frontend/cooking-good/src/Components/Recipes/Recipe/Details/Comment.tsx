import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import WarningIcon from "@mui/icons-material/Warning";
import React from "react";
import { RecipeType } from "../../../../types/recipe-types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import axios from "axios";
import { addSuccessNotification } from "../../../../store/reducers/notificationReducer";

const Comment = ({ comment, recipe }: myProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const handleReportComment = () => {
    axios
      .post(
        "http://localhost:8080/report",
        {
          comment: comment,
          recipe: recipe._id,
          reportCreator: user?.userId,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res);
        dispatch(addSuccessNotification({ message: "Zgłoszono komentarz." }));
      })
      .catch((err) => console.log(err));
  };
  return (
    <ListItem
      secondaryAction={
        <Tooltip title="Zgłoś">
          <IconButton size="small" onClick={handleReportComment}>
            <WarningIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    >
      <ListItemAvatar sx={{ display: "flex", alignSelf: "start", py: 1.5 }}>
        <Avatar
          src={
            comment.creator.image
              ? `http://localhost:8080/${comment.creator.image.replace(
                  "\\",
                  "/"
                )}`
              : ""
          }
        />
      </ListItemAvatar>
      <ListItemText
        sx={{ pr: 4 }}
        secondary={comment.content}
        primary={
          <Stack direction="row" alignItems="end">
            <Typography
              sx={{
                fontWeight: 600,
                mr: 1,
                // color: (theme) => theme.palette.text.dark,
              }}
            >
              {comment.creator.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: (theme) => theme.palette.primary.main,
              }}
            >
              {dayjs(comment.addedAt).format("DD.MM.YYYY")}
            </Typography>
          </Stack>
        }
      ></ListItemText>
    </ListItem>
  );
};

export default Comment;

type myProps = {
  comment: {
    content: string;
    creator: { name: string; image: string };
    addedAt: string;
  };
  recipe: RecipeType;
};
