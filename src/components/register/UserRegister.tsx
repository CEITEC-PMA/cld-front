"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
import { cpf } from "cpf-cnpj-validator";
import { isEmail } from "validator";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";

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
    setError,
  } = useForm<UserInputs>({ mode: "onBlur" });
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<UserInputs> = async (data) => {
    setLoading(true);
    if (!cpf.isValid(data.username)) {
      setError("username", {
        type: "manual",
        message: "CPF inválido",
      });
    }

    if (data.nome.length < 8) {
      setError("nome", {
        type: "manual",
        message: "Nome deve ter no mínimo 8 caracteres",
      });
    }

    if (!isEmail(data.email)) {
      setError("email", {
        type: "manual",
        message: "E-mail inválido",
      });
    }

    console.log(errors.username);

    if (!errors.username && !errors.nome && !errors.email) {
      // const response = await fetch(`${apiUrl}/v1/auth/register`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      // console.log(response);
      console.log(data);
    }
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
        padding={10}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={3} width="300px">
            <Box display="flex" flexDirection="column" gap={1}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="CPF"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    value={field.value}
                    onChange={field.onChange}
                    sx={{
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="nome"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="Nome completo"
                    value={field.value.toUpperCase()}
                    onChange={field.onChange}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="E-mail"
                    value={field.value}
                    error={!!errors.email}
                    onChange={field.onChange}
                    helperText={errors.email?.message}
                  />
                )}
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
