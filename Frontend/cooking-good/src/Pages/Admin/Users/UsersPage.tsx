import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store/store";
import { TUser } from "../../../types/user/TUser";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

export const showStatus = (status: string, sx?: object) => {
  if (status === "active")
    return (
      <Chip
        icon={<CheckIcon />}
        label="Aktywny"
        color="success"
        variant="outlined"
        sx={sx}
      />
    );
  if (status === "banned")
    return (
      <Chip
        icon={<BlockIcon />}
        label="Zbanowany"
        color="error"
        variant="outlined"
        sx={sx}
      />
    );
  if (status === "inactive")
    return (
      <Chip
        icon={<EmailIcon fontSize="small" />}
        label="Nieaktywny"
        color="warning"
        variant="outlined"
        sx={sx}
      />
    );
};
const UsersPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const [users, setUsers] = useState<TUser[] | []>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => console.log(err));
  };
  const handleChangeStatus = async (user: TUser) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    const response = await axios.put(
      `http://localhost:8080/users/status/${user.id}`,
      { status: newStatus },
      { headers: { Authorization: "Bearer " + token } }
    );
    if (response.status === 200) {
      setUsers((prev) => [
        ...prev.filter((user) => user.id !== response.data.user.id),
        response.data.user,
      ]);
    }
    console.log(response);
  };
  const handleChangeRole = async (user: TUser) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const response = await axios.put(
      `http://localhost:8080/users/role/${user.id}`,
      { role: newRole },
      { headers: { Authorization: "Bearer " + token } }
    );
    if (response.status === 200) {
      setUsers((prev) => [
        ...prev.filter((user) => user.id !== response.data.user.id),
        response.data.user,
      ]);
    }
    console.log(response);
  };

  const showRole = (role: string) => {
    if (role === "user")
      return (
        <Chip
          icon={<PersonIcon />}
          label="Użytkownik"
          color="secondary"
          variant="outlined"
        />
      );
    if (role === "admin")
      return (
        <Chip
          icon={<AdminPanelSettingsIcon />}
          label="Admin"
          color="info"
          variant="outlined"
        />
      );
  };

  return (
    <Container sx={{ mt: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Np.</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Rola</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          {!!users && users.length > 0 && (
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{showRole(user.role)}</TableCell>
                  <TableCell>{showStatus(user.status)}</TableCell>
                  <TableCell>
                    <Stack direction="row" justifyContent="space-between">
                      <Button onClick={() => handleChangeRole(user)}>
                        Zmień rolę na:{" "}
                        {user.role === "admin" ? "Użytkownik" : "Admin"}
                      </Button>
                      <Button onClick={() => handleChangeStatus(user)}>
                        {user.status === "active" ? "Zbanuj" : "Aktywuj"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UsersPage;
