import { CircularProgress, Stack } from "@mui/material";

const LoadingProgress = () => {
  return (
    <Stack sx={{ height: "50vh" }} justifyContent="center" alignItems="center">
      <CircularProgress />
    </Stack>
  );
};
export default LoadingProgress;
