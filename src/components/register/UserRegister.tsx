"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { apiUrl } from "@/utils/api";
import {
  Box,
  Button,
  Input,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export type UserInputs = {
  email: string;
  username: string;
  nome: string;
};

export default function UserRegister() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserInputs>({ mode: "onBlur" });
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  const onSubmit: SubmitHandler<UserInputs> = async (data) => {
    console.log(data);
    const response = await fetch(`${apiUrl}/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
  };

  return (
    <Box
      padding={4}
      justifyItems="center"
      alignItems="center"
      alignContent="center"
      sx={{ backgroundColor: "#ebebeb", borderRadius: "10px" }}
      height="90vh"
      display="flex"
      justifyContent="center"
    >
      <Box
        borderRadius="15px"
        padding={8}
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifySelf="center"
        justifyContent="space-around"
        justifyItems="center"
        height="100%"
        minWidth={smDown ? "350px" : mdDown ? "450px" : "600px"}
        sx={{ backgroundColor: "#fff" }}
      >
        <Typography align="center" variant="h3">
          Registro de usuário
        </Typography>
        <form>
          <Box display="flex" flexDirection="column" gap={3} width="300px">
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField
                fullWidth
                required
                id="outlined-required"
                label="CPF"
              />
              <TextField
                fullWidth
                required
                id="outlined-required"
                label="Senha"
              />
            </Box>
            <Button
              variant="contained"
              type="submit"
              size="large"
              endIcon={<LoginIcon />}
            >
              Enviar Cadastro
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
