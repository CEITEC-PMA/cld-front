"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/utils/api";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { signIn } from "next-auth/react";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import SimpleBackdrop from "../backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();
  const [openSnack, setOpenSnack] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAlert(false);
    setIsLoading(false);
  };

  const handleOpenAlert = () => {
    setIsLoading(false);
    setOpenAlert(true);
  };

  const handleCloseSnack = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
    router.push("/dashboard");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === rePassword);
  };

  const handleRePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRePassword = event.target.value;
    setRePassword(newRePassword);
    setPasswordsMatch(password === newRePassword);
  };

  const handleResetPassword = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${apiUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    })
      .then(async (response) => {
        setIsLoading(true);
        const resJson = await response.json();
        const tokenBackEnd = resJson.tokens.access.token;
        localStorage.setItem("token", tokenBackEnd);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        alert("Não foi possível concluir a solicitação!");
      });
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataToSend = {
      username: data.get("username"),
      password: data.get("senha"),
    };
    const { password, username } = dataToSend;
    if (!password) {
      setErrorMessage("Por favor digite uma senha");
      setOpen(true);
    }

    if (password && password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      setOpen(true);
    }

    setIsLoading(true);

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then(async (response) => {
        const resJson = await response.json();
        if (
          resJson.message ===
          "Usuário inativo. module o usuário em uma unidade para ativar"
        ) {
          handleOpenAlert();
        } else {
          if (response.status === 200) {
            if (resJson.user.acesso === 0) {
              const tokenBackEnd = resJson.resetPasswordToken;
              localStorage.setItem("token", tokenBackEnd);
              setIsLoading(false);
              handleOpenDialog();
            } else {
              const token = resJson.tokens.access.token;
              localStorage.setItem("token", token);
              setIsLoading(false);
              router.push("/dashboard");
            }
          } else if (response.status === 401) {
            setIsLoading(false);
            throw new Error("INEP/CPF ou senha inválidos");
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
        setOpen(true);
      });
  };

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  return (
    <Container maxWidth="xs">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          open={open}
          autoHideDuration={8000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="INEP/CPF"
            type="number"
            id="username"
            autoComplete="username"
            onChange={handleChangeUsername}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="senha-atual"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            endIcon={<LoginIcon />}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress /> : "Entrar"}
          </Button>

          <Typography variant="subtitle2" align="center">
            Não tem uma conta?{" "}
            <Link
              href="/register/user"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Registre-se aqui
            </Link>
          </Typography>

          <Dialog open={openDialog}>
            <DialogTitle>Redefina a sua senha</DialogTitle>
            <DialogContent>
              <DialogContentText marginBottom="8px">
                Neste primeiro acesso, redefina sua senha. Sua senha deve conter
                pelo menos 8 caracteres, com pelo menos 1 letra e 1 número.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Digite a sua senha"
                type="password"
                inputProps={{
                  minLength: 6,
                }}
                fullWidth
                error={
                  !!(
                    !passwordsMatch ||
                    (password && !passwordRegex.test(password))
                  )
                }
                helperText={
                  (!passwordsMatch && "As senhas não coincidem.") ||
                  (password &&
                    !passwordRegex.test(password) &&
                    "A senha deve ter pelo menos 8 caracteres, com pelo menos 1 letra e 1 número.")
                }
                onChange={handlePasswordChange}
              />
              <TextField
                error={!passwordsMatch}
                margin="dense"
                id="confirmpassword"
                label="Confirme a sua senha"
                type="password"
                inputProps={{
                  minLength: 6,
                }}
                fullWidth
                onChange={handleRePasswordChange}
                helperText={
                  (!passwordsMatch && "As senhas não coincidem.") ||
                  (rePassword &&
                    password !== rePassword &&
                    "As senhas não coincidem.")
                }
              />
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={handleCloseDialog}>Cancelar</Button> */}
              <Button
                variant="contained"
                disabled={!passwordsMatch || !passwordRegex.test(password)}
                onClick={handleResetPassword}
              >
                Enviar
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleCloseSnack}
          >
            <Alert
              onClose={(e) => handleCloseSnack(e)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Senha redefinida com sucesso!
            </Alert>
          </Snackbar>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openAlert}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Usuário Inativo
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <Typography gutterBottom>
                O registro do seu usuário foi encontrado em nosso banco de
                dados, porém se encontra com status &quot;Inativo&quot;.
              </Typography>
              <Typography gutterBottom>
                Solicite ao adminsitrador da sua Unidade de Ensino a ativação do
                seu usuário.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus variant="contained" onClick={handleClose}>
                ENTENDI
              </Button>
            </DialogActions>
          </BootstrapDialog>
          <SimpleBackdrop open={isLoading} />
        </Box>
      </Box>
    </Container>
  );
}
