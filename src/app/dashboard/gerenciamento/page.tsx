"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Backdrop,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  ptBR,
} from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "@/userContext";
import { ptBR as corePtBR } from "@mui/material/locale";
import { apiUrl } from "@/utils/api";
import Unauthorized from "@/components/unauthorized";

type FormData = {
  selectedTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
};

type Turma = {
  _id: string;
  nomeTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
};

export default function TurmasTotais() {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const { user } = useUserContext();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );
  const [rows, setRows] = useState<readonly Turma[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "nomeTurma", sort: "asc" },
  ]);

  const columns: GridColDef[] = [
    {
      field: "nomeTurma",
      headerName: "TURMA",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qtdeAlunos",
      headerName: "QTDE (alunos)",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qtdeProf",
      headerName: "QTDE (professores)",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    ptBR,
    corePtBR
  );

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/turma/gerenciamento`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRows(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("Erro ao obter dados do backend.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erro durante a busca de turmas:", error);
    }
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    reset({ selectedTurma: "", qtdeAlunos: null, qtdeProf: null });
    setSelectedItemId(null);
    setIsModalOpen(false);
    setOpenConfirm(false);
    setIsEditMode(false);
  };

  const handleSave: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);
      const { selectedTurma, qtdeAlunos, qtdeProf } = data;
      const turmaExists = rows.some((row) => row.nomeTurma === selectedTurma);

      if (turmaExists && !isEditMode) {
        console.error(
          "Essa turma já existe, favor verificar e/ou editar os dados."
        );
        alert("Essa turma já existe, favor verificar e/ou editar os dados.");
        setIsLoading(false);
        handleClose();
      } else if (isEditMode) {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}/api/v1/turma/${selectedItemId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              qtdeAlunos: qtdeAlunos,
              qtdeProf: qtdeProf,
            }),
          }
        );

        if (response.ok) {
          console.log(data);
          console.log("Sucesso ao editar:", await response.json());
          reset();
          setIsModalOpen(false);
          setIsLoading(false);
          handleClose();
          fetchTurmas();
        } else {
          setIsLoading(false);
          console.error("Erro ao editar a turma.");
        }
      } else {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/v1/turma`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nomeTurma: selectedTurma,
            qtdeAlunos: qtdeAlunos,
            qtdeProf: qtdeProf,
            zona: user._id,
          }),
        });

        if (response.ok) {
          reset();
          setIsModalOpen(false);
          setIsLoading(false);
          fetchTurmas();
        } else {
          setIsLoading(false);
          console.error("Erro ao salvar a turma.");
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Por favor, preencha todos os campos antes de salvar.");
      alert("Por favor, preencha todos os campos antes de salvar.");
    }
  };

  const handleEditar = (id: string) => {
    console.log(id);
    setSelectedItemId(id);
    setIsModalOpen(true);
    setIsEditMode(true);

    const selectedRow = rows.find((row) => row._id === id);

    if (selectedRow) {
      setValue("selectedTurma", selectedRow.nomeTurma);
      setValue("qtdeAlunos", selectedRow.qtdeAlunos);
      setValue("qtdeProf", selectedRow.qtdeProf);
    }
  };

  const handleDeletar = async (id: string) => {
    setSelectedItemId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItemId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}/api/v1/turma/${selectedItemId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchTurmas();
        } else {
          console.error(`Erro ao excluir turma`);
          alert(`Erro ao excluir turma`);
        }
      } catch (error) {
        console.error("Erro durante a exclusão:", error);
        alert("Erro durante a exclusão");
      } finally {
        setSelectedItemId(null);
        setOpenConfirm(false);
      }
    }
  };

  if (!user.role || !user.role.includes("super-adm")) return <Unauthorized />;

  return (
    <Box margin="24px">
      <Container>
        {isLoading ? (
          <Typography variant="h3" marginBottom="12px" textAlign="center">
            Carregando
          </Typography>
        ) : (
          <>
            <Typography variant="h3" marginBottom="8px" textAlign="center">
              Lista de Turmas
            </Typography>
            <Typography variant="h5" marginBottom="6px" textAlign="center">
              Gerenciamento - Quantidades Totais
            </Typography>
            <Box marginTop="8px" width="100%" maxWidth="800px" marginX="auto">
              <Box
                marginTop="16px"
                width="100%"
                maxWidth="800px"
                marginX="auto"
              >
                <ThemeProvider theme={theme}>
                  <DataGrid
                    getRowId={(row) => row._id}
                    rows={rows}
                    columns={columns}
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    localeText={
                      ptBR?.components?.MuiDataGrid?.defaultProps.localeText
                    }
                    disableRowSelectionOnClick
                  />
                </ThemeProvider>
              </Box>
            </Box>{" "}
          </>
        )}
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={isModalOpen}
          onClose={handleClose}
        >
          <DialogTitle>
            {selectedItemId ? "Editar turma" : "Adicionar nova turma"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Selecione a turma e insira a quantidade de alunos
            </DialogContentText>
            <form onSubmit={handleSubmit(handleSave)}>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                  gap: "4px",
                }}
              >
                <FormControl sx={{ mt: 6, minWidth: 120 }}>
                  <InputLabel htmlFor="nomeTurma">Turma</InputLabel>
                  <Controller
                    name="selectedTurma"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Por favor, selecione uma turma." }}
                    render={({ field }) => (
                      <Select {...field} disabled={isEditMode}>
                        <MenuItem value="1º Ano">1º Ano</MenuItem>
                        <MenuItem value="2º Ano">2º Ano</MenuItem>
                        <MenuItem value="3º Ano">3º Ano</MenuItem>
                        <MenuItem value="4º Ano">4º Ano</MenuItem>
                        <MenuItem value="5º Ano">5º Ano</MenuItem>
                        <MenuItem value="6º Ano">6º Ano</MenuItem>
                        <MenuItem value="7º Ano">7º Ano</MenuItem>
                        <MenuItem value="8º Ano">8º Ano</MenuItem>
                        <MenuItem value="9º Ano">9º Ano</MenuItem>
                        <MenuItem value="Infantil I">Infantil I</MenuItem>
                        <MenuItem value="Infantil II">Infantil II</MenuItem>
                        <MenuItem value="Infantil III">Infantil III</MenuItem>
                        <MenuItem value="Infantil IV">Infantil IV</MenuItem>
                        <MenuItem value="Infantil V">Infantil V</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.selectedTurma && (
                    <Typography variant="caption" color="error">
                      {errors.selectedTurma.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl sx={{ mt: 3 }}>
                  <Controller
                    name="qtdeAlunos"
                    control={control}
                    rules={{
                      required: "Por favor, insira a quantidade de alunos.",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quantidade de Alunos"
                        variant="outlined"
                        type="number"
                      />
                    )}
                  />
                  {errors.qtdeAlunos && (
                    <Typography variant="caption" color="error">
                      {errors.qtdeAlunos.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl sx={{ mt: 3 }}>
                  <Controller
                    name="qtdeProf"
                    control={control}
                    rules={{
                      required:
                        "Por favor, insira a quantidade de professores.",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Insira apenas números inteiros.",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quantidade de Professores"
                        variant="outlined"
                        type="number"
                        InputProps={{
                          inputProps: {
                            pattern: /^[0-9]+$/,
                          },
                        }}
                      />
                    )}
                  />
                  {errors.qtdeProf && (
                    <Typography variant="caption" color="error">
                      {errors.qtdeProf.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <DialogActions sx={{ mt: 2 }}>
                <Button
                  startIcon={<CheckIcon />}
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  {selectedItemId ? "Salvar" : "Criar turma"}
                </Button>
                <Button
                  startIcon={<BlockIcon />}
                  variant="contained"
                  color="error"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openConfirm}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Tem certeza que deseja excluir a turma?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Essa ação não poderá ser desfeita!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<CheckIcon />}
              variant="contained"
              color="success"
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
            <Button
              startIcon={<BlockIcon />}
              variant="contained"
              color="error"
              onClick={handleClose}
            >
              Voltar
            </Button>
          </DialogActions>
        </Dialog>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Box>
  );
}
