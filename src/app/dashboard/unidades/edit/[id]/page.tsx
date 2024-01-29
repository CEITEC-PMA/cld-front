"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import InputMask from "react-input-mask";

import { apiUrl } from "@/utils/api";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";
import { TUser } from "@/utils/types/user.types";
import { useUserContext } from "@/userContext";
import Unauthorized from "@/components/unauthorized";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

interface Props {
  params: { id: string };
  onSubmit: SubmitHandler<TUnidadeEscolar>;
}

const UnidadeEdit: React.FC<Props> = ({ onSubmit, params }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const { control, handleSubmit, setValue, watch, getValues } =
    useForm<TUnidadeEscolar>({ mode: "onBlur" });
  const { id: idUnidade } = params;
  const [leaflet, setLeaflet] = useState<any>(null);
  const cep = watch("endereco.cep");
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [unidades, setUnidades] = useState<TUnidadeEscolar[]>([]);
  const [users, setUsers] = useState<TUser[]>([]);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    import("leaflet").then((L) => {
      setLeaflet(L);
    });
  }, []);

  const [markerCoordinates, setMarkerCoordinates] = useState([
    // 0, 0,
    -16.331728890115176, -48.94959155640654,
  ]);
  const [centerCoordinates, setCenterCoordinates] = useState([
    // 0, 0,
    -16.331728890115176, -48.94959155640654,
  ]);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  useEffect(() => {
    const loadUnidadeData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${apiUrl}/v1/unidade/${idUnidade}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados");
        }

        const responseJson = await response.json();
        setUnidades([responseJson]);
        fetchData(`${apiUrl}/v1/users?limit=200`, setUsers);

        setUnidades([responseJson]);

        setValue("nome", responseJson.nome || "");
        setValue("userId", responseJson.userId || "");
        setValue("inep", responseJson.inep || 0);
        setValue("fone", responseJson.fone || "");
        setValue("email", responseJson.email || "");
        setValue("endereco.cep", responseJson.endereco.cep || "");
        setValue("endereco.logradouro", responseJson.endereco.logradouro || "");
        setValue(
          "endereco.complemento",
          responseJson.endereco.complemento || ""
        );
        setValue("endereco.quadra", responseJson.endereco.quadra || "");
        setValue("endereco.lote", responseJson.endereco.lote || "");
        setValue("endereco.bairro", responseJson.endereco.bairro || "");
        setValue("endereco.localidade", responseJson.endereco.localidade || "");
        setValue("endereco.uf", responseJson.endereco.uf || "");

        setValue(
          "location.coordinates.0",
          responseJson.location.coordinates[0].toString()
        );
        setValue(
          "location.coordinates.1",
          responseJson.location.coordinates[1].toString()
        );

        setMarkerCoordinates([
          parseFloat(responseJson.location.coordinates[0]),
          parseFloat(responseJson.location.coordinates[1]),
        ]);
        setCenterCoordinates([
          parseFloat(responseJson.location.coordinates[0]),
          parseFloat(responseJson.location.coordinates[1]),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUnidadeData();
  }, [idUnidade, user.id]);

  const MapEventWrapper = () => {
    if (!leaflet) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerCoordinates([lat, lng]);
        setValue("location.coordinates.0", lat.toString());
        setValue("location.coordinates.1", lng.toString());
      },
    });

    return null;
  };

  const onSubmitHandler: SubmitHandler<TUnidadeEscolar> = async () => {
    const formData = getValues();
    const token = localStorage.getItem("token");
    const url = `${apiUrl}/v1/unidade/${idUnidade}`;
    const method = "PATCH";

    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setIsLoading(false);
        setIsError(true);
        setOpenModal(true);
        throw new Error(`Failed to update data`);
      }

      console.log(`Dados atualizados com sucesso`, formData);
      setIsLoading(false);
      setOpenModal(true);

      await onSubmit(formData);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setOpenModal(true);
      console.error(`Erro ao atualizar os dados:`, error);
    }
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

  const handleCloseModal = () => {
    setOpenModal(false);
    router.push("/dashboard/unidades");
  };

  if (!user.role || user.role !== "admin") return <Unauthorized />;

  return (
    <Box
      padding={smDown ? 2 : mdDown ? 3 : 4}
      sx={{ backgroundColor: "#ebebeb", borderRadius: "10px" }}
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
          {unidades.length > 0
            ? `Editar Unidade de Ensino - ${unidades[0].nome}`
            : "Carregando"}
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
                name="userId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    id="userId"
                    options={users}
                    getOptionLabel={(user) => user.nome}
                    value={
                      users.find((user) =>
                        Array.isArray(field.value)
                          ? field.value.includes(user.id)
                          : user.id === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.id : "");
                    }}
                    sx={{ width: "65%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Administrador da Unidade de Ensino"
                      />
                    )}
                  />
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
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Quadra"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={mdDown ? 3 : 1.05}>
                <Controller
                  name="endereco.lote"
                  control={control}
                  render={({ field }) => (
                    <TextField fullWidth type="text" label="Lote" {...field} />
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
                <InputLabel id="userId">Coordenada X</InputLabel>
                <Controller
                  name="location.coordinates.0"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="string"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel id="userId">Coordenada Y</InputLabel>
                <Controller
                  name="location.coordinates.1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="string"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid xs={12} padding="20px 16px">
              {unidades.length > 0 ? (
                <MapContainer
                  center={centerCoordinates as LatLngTuple}
                  zoom={!!idUnidade ? 16 : 12}
                  style={{ height: "400px", width: "100%" }}
                >
                  <MapEventWrapper />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {leaflet && markerCoordinates[0] && markerCoordinates[1] && (
                    <Marker position={markerCoordinates as LatLngTuple}>
                      <Popup>Marcador</Popup>
                    </Marker>
                  )}
                </MapContainer>
              ) : (
                <div>Carregando...</div>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              margin="0 4px"
              alignItems="center"
              justifyItems="center"
              display="flex"
              flexDirection="column"
            >
              <Button
                endIcon={<SaveIcon />}
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmitHandler)}
              >
                SALVAR DADOS
              </Button>
            </Grid>
            <BootstrapDialog
              onClose={handleCloseModal}
              aria-labelledby="customized-dialog-title"
              open={openModal}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {!isError ? "Erro" : "Sucesso!"}
              </DialogTitle>
              <DialogContent>
                <Typography gutterBottom>
                  {!isError
                    ? "Não foi possível concluir a solicitação"
                    : "Dados atualizados com sucesso!"}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={handleCloseModal}
                  variant="contained"
                >
                  OK
                </Button>
              </DialogActions>
            </BootstrapDialog>
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

export default UnidadeEdit;
