import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import React from "react";
import { IPost } from "../types/post-types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

const PostCard = ({ post, onDelete }: myProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePostDelete = (postId: string) => {
    axios
      .delete(`http://localhost:8080/post/${postId}`)
      .then((res) => {
        if (res.status === 200) {
          onDelete(postId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    handleMenuClose();
  };

  return (
    <Paper>
      <Card>
        <CardHeader
          title={
            <Typography
              sx={{
                color: (theme) => theme.palette.primary.main,
                fontSize: 24,
              }}
            >
              {post.title}
            </Typography>
          }
          action={
            <>
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => handlePostDelete(post.id)}>
                  Usuń
                </MenuItem>
              </Menu>
            </>
          }
          subheader={`${dayjs(post.addetAt).format("DD.MM.YYYY")} - ${
            post.creator.name
          }`}
        />
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:8080/${post.image}`}
          alt={post.title}
        />
        <CardContent>
          <Collapse collapsedSize={0} in={expanded} timeout="auto">
            <div
              dangerouslySetInnerHTML={{
                __html: post.description,
              }}
            />
          </Collapse>
          <Button onClick={handleExpandClick} sx={{ width: "100%" }}>
            <ExpandMoreIcon
              sx={{
                transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </Button>
        </CardContent>
      </Card>
    </Paper>
  );
};
export default PostCard;

type myProps = {
  post: IPost;
  onDelete: (postId: string) => void;
};
