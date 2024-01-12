"use client";
import React from "react";
import Unauthorized from "@/components/unauthorized";
import { useUserContext } from "@/userContext";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export type TForm = {
  name: string;
  inep: number;
  fone: string;
  email: string;
  coordinates: number[];
  endereco: Endereco;
};

export type Endereco = {
  cep: string;
  logradouro: string;
  complemento: string;
  quadra: string;
  lote: string;
  bairro: string;
  localidade: string;
  uf: string;
};

interface Props {
  onSubmit: SubmitHandler<TForm>;
}

const UnidadeRegistro: React.FC<Props> = ({ onSubmit }) => {
  const { user } = useUserContext();
  const { control, handleSubmit } = useForm<TForm>();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  if (!user.role || user.role !== "admin") return <Unauthorized />;

  return (
    <Box padding={2} border="2px solid #c66">
      <Typography variant={smDown ? "h4" : mdDown ? "h4" : "h3"} align="center">
        Cadastro de Unidade de Ensino
      </Typography>
      <Box padding={4} border="2px solid #0c66">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} border="2px solid #c66">
            <Grid item xs={6} border="2px solid #c66">
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField fullWidth label="Nome" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="inep"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField fullWidth type="number" label="INEP" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="fone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField fullWidth label="Telefone" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField type="email" fullWidth label="Email" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="coordinates"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <TextField fullWidth label="Coordenadas" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="endereco.cep"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField fullWidth label="CEP" {...field} />
                )}
              />
            </Grid>
            {/* Adicione os campos restantes de Endereco da mesma forma */}
            <Grid item xs={12}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default UnidadeRegistro;
