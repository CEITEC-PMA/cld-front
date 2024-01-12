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
import CheckIcon from "@mui/icons-material/Check";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export type TForm = {
  name: string;
  inep: number;
  fone: string;
  email: string;
  endereco: {
    coordinates: {
      coordinateX: number;
      coordinateY: number;
    };
    cep: string;
    logradouro: string;
    complemento: string;
    quadra: number;
    lote: number;
    bairro: string;
    localidade: string;
    uf: string;
  };
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
    <Box
      padding={smDown ? 2 : mdDown ? 3 : 4}
      alignItems="center"
      alignContent="center"
      sx={{ backgroundColor: "#ebebeb", borderRadius: "10px" }}
      height="90vh"
    >
      <Box padding={2} sx={{ backgroundColor: "#fff" }}>
        <Typography
          variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
          align="center"
          marginBottom="8px"
          noWrap
          sx={{
            backgroundColor: "#dedede",
            borderRadius: "10px",
            padding: "4px",
            fontWeight: "bold",
          }}
        >
          Cadastro de Unidade de Ensino
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container padding={2} spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography
                variant={smDown ? "h6" : "h5"}
                sx={{ backgroundColor: "#" }}
              >
                Dados Gerais
              </Typography>
            </Grid>
            <Grid item xs={mdDown ? 12 : 8}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    autoFocus
                    fullWidth
                    label="Nome da Unidade de Ensino"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={mdDown ? 6 : 2}>
              <Controller
                name="inep"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    type="number"
                    label="INEP"
                    sx={{
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={mdDown ? 6 : 2}>
              <Controller
                name="fone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    fullWidth
                    type="number"
                    label="Telefone"
                    sx={{
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={mdDown ? 12 : 4}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField type="email" fullWidth label="Email" {...field} />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              justifyItems="center"
              alignItems="center"
              alignContent="center"
            >
              <Typography variant={smDown ? "h6" : "h5"}>Endereço</Typography>
            </Grid>
            <Grid item container xs={12} display="flex" spacing={2}>
              <Grid item xs={smDown ? 3.5 : mdDown ? 3 : 1}>
                <Controller
                  name="endereco.cep"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="CEP"
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={smDown ? 12 : mdDown ? 12 : 5}>
                <Controller
                  name="endereco.logradouro"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="string"
                      label="Logradouro"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={smDown ? 12 : mdDown ? 6 : 3}>
                <Controller
                  name="endereco.complemento"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="string"
                      label="Complemento"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 3 : 1.5}>
                <Controller
                  name="endereco.quadra"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="Quadra"
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 3 : 1.5}>
                <Controller
                  name="endereco.lote"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="Lote"
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 12 : 3}>
                <Controller
                  name="endereco.bairro"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="string"
                      label="Bairro"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 12 : 4}>
                <Controller
                  name="endereco.localidade"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="string"
                      label="Localidade"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 3 : 1}>
                <Controller
                  name="endereco.uf"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <TextField fullWidth type="string" label="UF" {...field} />
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              xs={mdDown ? 12 : 6}
              display="flex"
              spacing={2}
            >
              <Grid item xs={6}>
                <Controller
                  name="endereco.coordinates.coordinateX"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="Coordenada X"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
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
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="endereco.coordinates.coordinateY"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="Coordenada Y"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
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
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            marginTop="16px"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Button
              startIcon={<CheckIcon />}
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              SALVAR DADOS
            </Button>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default UnidadeRegistro;
