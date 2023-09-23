import { Button, Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import axios from "axios";
import { IPost } from "../../../types/post-types";
import { Masonry } from "@mui/lab";
import { Box } from "@mui/system";
import PostCard from "../../../Components/PostCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const PostListPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    handlePostAdded();
  }, []);

  const handlePostAdded = () => {
    axios
      .get("http://localhost:8080/post")
      .then((res) => {
        setPosts(res.data.posts);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.darker,
      }}
    >
      <Container
        sx={{
          pt: 4,
        }}
      >
        {user && user.role === "admin" && (
          <Stack alignItems="end" sx={{ m: 1 }}>
            <Button
              sx={{ color: (theme) => theme.palette.text.light }}
              variant="contained"
              onClick={() => setOpenCreateDialog(true)}
            >
              Dodaj ciekawostkę
            </Button>
          </Stack>
        )}
        <CreatePost
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onSave={handlePostAdded}
        />
        <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>
          {posts.length > 0 &&
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                showMenu={!!user && user.role === "admin"}
                onDelete={(postId) => {
                  setPosts((prev) => prev.filter((c) => c.id !== postId));
                }}
              />
            ))}
        </Masonry>
      </Container>
    </Box>
  );
};
export default PostListPage;
