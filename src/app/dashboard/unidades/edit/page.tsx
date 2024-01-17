"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import InputMask from "react-input-mask";

import { apiUrl } from "@/utils/api";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";
import { TUser } from "@/utils/types/user.types";
import { useUserContext } from "@/userContext";
import Unauthorized from "@/components/unauthorized";

interface Props {
  onSubmit: SubmitHandler<TUnidadeEscolar>;
}

const UnidadeRegistro: React.FC<Props> = ({ onSubmit }) => {
  const { user } = useUserContext();
  const { control, handleSubmit, setValue, watch, getValues } =
    useForm<TUnidadeEscolar>();
  const cep = watch("endereco.cep");
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoading, setIsLoading] = useState(false);
  const [unidades, setUnidades] = useState<TUnidadeEscolar[]>([]);
  const [users, setUsers] = useState<TUser[]>([]);
  const unidadeParams = useSearchParams();

  const idUnidade = unidadeParams.get("id");

  const onSubmitHandler: SubmitHandler<TUnidadeEscolar> = async () => {
    const formData = getValues(); // Obter os dados do formulário
    console.log("Dados a serem enviados para o backend:", formData);

    // Outras lógicas ou chamadas de API aqui
    await onSubmit(formData);
  };

  const fetchData = async (url: string, setData: Function) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseJson = await response.json();
      setData(responseJson.results);
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUnidadeData = async () => {
      if (idUnidade) {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        try {
          const response = await fetch(`${apiUrl}/v1/unidade/${idUnidade}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const responseJson = await response.json();
          setUnidades([responseJson]);
          fetchData(`${apiUrl}/v1/users?limit=200`, setUsers);

          setUnidades([responseJson]);

          setValue("nome", responseJson.nome || "");
          setValue("userAdmin", responseJson.userAdmin || "");
          setValue("inep", responseJson.inep || 0);
          setValue("fone", responseJson.fone || "");
          setValue("email", responseJson.email || "");

          setValue("endereco.cep", responseJson.endereco.cep || "");
          setValue(
            "endereco.logradouro",
            responseJson.endereco.logradouro || ""
          );
          setValue(
            "endereco.complemento",
            responseJson.endereco.complemento || ""
          );
          setValue("endereco.quadra", responseJson.endereco.quadra || "");
          setValue("endereco.lote", responseJson.endereco.lote || "");
          setValue("endereco.bairro", responseJson.endereco.bairro || "");
          setValue(
            "endereco.localidade",
            responseJson.endereco.localidade || ""
          );
          setValue("endereco.uf", responseJson.endereco.uf || "");

          setValue(
            "endereco.coordinates.coordinateX",
            responseJson.endereco.coordinates.coordinateX || 0
          );
          setValue(
            "endereco.coordinates.coordinateY",
            responseJson.endereco.coordinates.coordinateY || 0
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        fetchData(`${apiUrl}/v1/unidade?limit=200`, setUnidades);
        fetchData(`${apiUrl}/v1/users?limit=200`, setUsers);
        setIsLoading(false);
      }
    };

    loadUnidadeData();
  }, [idUnidade, user.id]);

  const handleBuscaCep = async () => {
    if (cep?.length !== 8 || !isValidCEP(cep)) {
      alert("CEP inválido, digite novamente!");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const resJson = await response.json();

      setValue("endereco.logradouro", resJson.logradouro?.toUpperCase() || "");
      setValue("endereco.bairro", resJson.bairro?.toUpperCase() || "");
      setValue("endereco.localidade", resJson.localidade?.toUpperCase() || "");
      setValue("endereco.uf", resJson.uf?.toUpperCase() || "");
    } catch (error) {
      alert("Falha ao receber os dados do CEP");
    }
  };

  const isValidCEP = (cep: string) => /^[0-9]{8}$/.test(cep);

  useEffect(() => {
    const handleAutoFetch = async () => {
      if (cep?.length === 8 && isValidCEP(cep)) {
        await handleBuscaCep();
        const logradouroInput = document.getElementById("endereco.logradouro");
        logradouroInput?.focus();
      }
    };

    handleAutoFetch();
  }, [cep]);

  if (!user.role || user.role !== "admin") return <Unauthorized />;

  return (
    <Box
      padding={smDown ? 2 : mdDown ? 3 : 4}
      sx={{ backgroundColor: "#ebebeb", borderRadius: "10px", height: "99vh" }}
    >
      <Box padding={2} sx={{ backgroundColor: "#fff" }}>
        <Typography
          variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
          align="center"
          marginBottom="8px"
          sx={{
            backgroundColor: "#dedede",
            borderRadius: "10px",
            padding: "4px",
            fontWeight: "bold",
            fontSize: "36px",
          }}
        >
          {idUnidade && unidades.length > 0
            ? `Editar Unidade de Ensino - ${unidades[0]?.nome || ""}`
            : "Cadastrar Unidade de Ensino"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container padding={2} spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography
                variant={smDown ? "h6" : "h5"}
                sx={{ backgroundColor: "#" }}
              >
                Dados Gerais
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      label="Nome da Unidade de Ensino"
                      fullWidth
                      value={
                        idUnidade
                          ? unidades && unidades.length > 0
                            ? unidades[0]?.nome || ""
                            : ""
                          : field.value
                      }
                      onChange={(e) => {
                        if (!idUnidade) {
                          field.onChange(e.target.value.toUpperCase());
                        }
                      }}
                      InputProps={{
                        readOnly: !!idUnidade,
                      }}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="userAdmin"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputLabel id="userAdmin">
                      Administrador da Unidade de Ensino
                    </InputLabel>
                    <Select
                      labelId="userAdmin"
                      label="Administrador da Unidade de Ensino"
                      value={field.value || ""}
                      onChange={(e) => {
                        const userSelecionado = users.find(
                          (user: TUser) => user.nome === e.target.value
                        );

                        if (userSelecionado) {
                          const idUserSelecionado = userSelecionado.id;
                        }

                        field.onChange(e);
                      }}
                    >
                      {users &&
                        users.map((user: TUser, i) => (
                          <MenuItem key={i} value={user.nome}>
                            {user.nome}
                          </MenuItem>
                        ))}
                    </Select>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={smDown ? 4 : 3}>
              <Controller
                name="inep"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    type="number"
                    label="INEP"
                    InputProps={{ readOnly: !!idUnidade }}
                    value={
                      idUnidade && unidades.length > 0
                        ? unidades[0]?.inep
                        : field.value
                    }
                    onChange={(e) => {
                      if (!idUnidade) {
                        field.onChange(e);
                      }
                    }}
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
            <Grid item xs={mdDown ? 6 : 2.5}>
              <Controller
                name="fone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputMask
                    mask="(62) 9999-9999"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {
                      //@ts-ignore
                      () => (
                        <TextField
                          fullWidth
                          type="tel"
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
                        />
                      )
                    }
                  </InputMask>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="email"
                    fullWidth
                    label="Email"
                    InputProps={{ readOnly: !!idUnidade }}
                    value={
                      idUnidade && unidades.length > 0
                        ? unidades[0]?.email
                        : field.value
                    }
                    onChange={(e) => {
                      if (!idUnidade) {
                        field.onChange(e);
                      }
                    }}
                  />
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
              <Grid item xs={smDown ? 4.2 : mdDown ? 3 : 1.9}>
                <Controller
                  name="endereco.cep"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputMask
                      mask="99999999"
                      maskChar=""
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={handleBuscaCep}
                    >
                      {
                        // @ts-ignore
                        () => <TextField fullWidth type="text" label="CEP" />
                      }
                    </InputMask>
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
                      value={field.value?.toUpperCase()}
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
                      value={field.value?.toUpperCase()}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 3 : 1.05}>
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
              <Grid item xs={mdDown ? 3 : 1.05}>
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
                      InputProps={{ readOnly: true }}
                      {...field}
                      value={field.value?.toUpperCase()}
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
                      InputProps={{ readOnly: true }}
                      {...field}
                      value={field.value?.toUpperCase()}
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
                    <TextField
                      fullWidth
                      type="string"
                      label="UF"
                      InputProps={{ readOnly: true }}
                      {...field}
                      value={field.value?.toUpperCase()}
                    />
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
            margin="24px 0"
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Box>
  );
};

export default UnidadeRegistro;
