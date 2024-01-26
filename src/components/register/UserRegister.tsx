"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { apiUrl } from "@/utils/api";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";
import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";
import SimpleBackdrop from "../backdrop";
import { useRouter } from "next/navigation";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Link from "next/link";

const schema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  username: z.string().refine((value) => cpf.isValid(value), {
    message: "CPF inválido",
  }),
  nome: z.string().min(8, { message: "Nome deve ter no mínimo 8 caracteres" }),
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export type UserInputs = z.infer<typeof schema>;

export default function UserRegister() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<UserInputs>({ mode: "onBlur" });
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<UserInputs> = async (data) => {
    setLoading(true);

    try {
      schema.parse(data);
      console.log(schema.parse(data));

      const response = await fetch(`${apiUrl}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      setOpenAlert(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((validationError) => {
          const field = validationError.path[0] as keyof UserInputs;
          setError(field, {
            type: "manual",
            message: validationError.message,
          });
        });
        console.log("entrou no erro");
      }
    }

    setLoading(false);
  };

  const handleOk = () => {
    router.push("/");
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
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <HowToRegIcon />
        </Avatar>
        <Typography align="center" variant="h5">
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
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Cadastro"}
            </Button>
            <Typography variant="subtitle2" align="center">
              Já tem uma conta?{" "}
              <Link
                href="/"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Faça seu login
              </Link>
            </Typography>
          </Box>
        </form>
        <BootstrapDialog
          aria-labelledby="customized-dialog-title"
          open={openAlert}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Cadastro de usuário concluído!
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              O registro do seu usuário foi concluído com sucesso!
            </Typography>
            <Typography gutterBottom>Sua senha inicial é:</Typography>
            <Typography align="center" sx={{ fontWeight: "bold" }} gutterBottom>
              inep123456
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" onClick={handleOk}>
              ENTENDI
            </Button>
          </DialogActions>
        </BootstrapDialog>
        <SimpleBackdrop open={loading} />
      </Box>
    </Box>
  );
}
