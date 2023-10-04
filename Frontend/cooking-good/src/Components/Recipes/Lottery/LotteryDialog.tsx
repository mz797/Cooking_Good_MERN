import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

const LotteryDialog = () => {
  return (
    <Dialog open={false}>
      <DialogTitle>Zanim poznasz danie, odpowiedz na pytanie</DialogTitle>
      <DialogContent>
        <Typography>Jaki posiłek Ciebie interesuje?</Typography>
      </DialogContent>
    </Dialog>
  );
};
export default LotteryDialog;
