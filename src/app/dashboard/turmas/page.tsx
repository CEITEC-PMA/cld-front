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

type FormData = {
  selectedTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
};

type Turma = {
  id: string;
  deletado: boolean;
  unidadeId: string[];
  nameTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
};

type UnidadeTurmas = {
  id: string;
  nome: string;
};

export default function Turmas() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [rows, setRows] = useState<readonly Turma[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unidades, setUnidades] = useState<UnidadeTurmas[]>([] || undefined);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState("");
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "nomeTurma", sort: "asc" },
  ]);

  const columns: GridColDef[] = [
    {
      field: "nameTurma",
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
    {
      field: "acoes",
      headerName: "Ações",
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEditar(params.row.id)}
            title="Editar"
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDeletar(params.row.id)}
            title="Remover"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
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
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data.unidadeId);
      } else {
        console.error("Erro ao obter dados das unidades do backend.");
      }
    } catch (error) {
      console.error("Erro durante a busca de unidades:", error);
    }
  };

  const fetchTurmas = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/v1/turma?unidadeId=${selectedUnidadeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRows(data.results);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("Erro ao obter dados do backend.");
        setRows([]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erro durante a busca de turmas:", error);
      setRows([]);
    }
  };

  const fetchTurmasId = async (unidadeId: string) => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/v1/turma?unidadeId=${unidadeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRows(data.results);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error("Erro ao obter dados do backend.");
        setRows([]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erro durante a busca de turmas:", error);
      setRows([]);
    }
  };

  const handleUnidadeChange = (unidadeId: string) => {
    setSelectedUnidadeId(unidadeId);
    fetchTurmasId(unidadeId);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    reset({ selectedTurma: "", qtdeAlunos: null, qtdeProf: null });
    setSelectedItemId("");
    setIsModalOpen(false);
    setOpenConfirm(false);
    setIsEditMode(false);
  };

  const handleSave: SubmitHandler<FormData> = async (data) => {
    try {
      setIsLoading(true);
      const { selectedTurma, qtdeAlunos, qtdeProf } = data;
      const turmaExists = rows.some((row) => row.nameTurma === selectedTurma);

      if (turmaExists && !isEditMode) {
        console.error(
          "Essa turma já existe, favor verificar e/ou editar os dados."
        );
        alert("Essa turma já existe, favor verificar e/ou editar os dados.");
        setIsLoading(false);
        handleClose();
      } else if (isEditMode) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/v1/turma/${selectedItemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            qtdeAlunos: qtdeAlunos,
            qtdeProf: qtdeProf,
          }),
        });

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
        const response = await fetch(`${apiUrl}/v1/turma`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            unidadeId: selectedUnidadeId,
            nameTurma: selectedTurma,
            qtdeAlunos: qtdeAlunos,
            qtdeProf: qtdeProf,
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
      console.error(
        "Por favor, preencha todos os campos antes de salvar.",
        error
      );
      alert("Por favor, preencha todos os campos antes de salvar.");
    }
  };

  const handleEditar = (id: string) => {
    setSelectedItemId(id);
    setIsModalOpen(true);
    setIsEditMode(true);

    const selectedRow = rows.find((row) => row.id === id);

    if (selectedRow) {
      setValue("selectedTurma", selectedRow.nameTurma);
      setValue("qtdeAlunos", selectedRow.qtdeAlunos);
      setValue("qtdeProf", selectedRow.qtdeProf);
    }
  };

  const handleDeletar = async (id: string) => {
    setSelectedItemId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/v1/turma/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deletado: true,
        }),
      });

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
      setSelectedItemId("");
      setOpenConfirm(false);
    }
  };

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h3" marginBottom="8px" textAlign="center">
          Lista de Turmas
        </Typography>
        <Box
          marginTop="8px"
          width="100%"
          maxWidth="800px"
          marginX="auto"
          gap={2}
        >
          <Box
            marginBottom="16px"
            alignContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <FormControl sx={{ backgroundColor: "#fff", minWidth: "200px" }}>
              <InputLabel htmlFor="selectUnidade">
                Selecione a Unidade
              </InputLabel>
              <Select
                id="selectUnidade"
                value={selectedUnidadeId}
                onChange={(e) => handleUnidadeChange(e.target.value)}
                fullWidth
              >
                {unidades.map((unidade, i) => (
                  <MenuItem key={i} value={unidade.id}>
                    {unidade.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedUnidadeId && (
            <>
              <Button
                startIcon={<AddCircleIcon />}
                size="large"
                variant="contained"
                onClick={openModal}
              >
                Adicionar turma
              </Button>
              <Box
                marginTop="16px"
                width="100%"
                maxWidth="800px"
                marginX="auto"
                sx={{ backgroundColor: "#fff" }}
              >
                <ThemeProvider theme={theme}>
                  <DataGrid
                    getRowId={(row) => row.id}
                    rows={rows || []}
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
            </>
          )}
        </Box>{" "}
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
              Selecione a Unidade de Ensino da turma e insira as quantidades de
              alunos e professores
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
                        <MenuItem value="INFANTIL I">INFANTIL I</MenuItem>
                        <MenuItem value="INFANTIL II">INFANTIL II</MenuItem>
                        <MenuItem value="INFANTIL III">INFANTIL III</MenuItem>
                        <MenuItem value="INFANTIL IV">INFANTIL IV</MenuItem>
                        <MenuItem value="INFANTIL V">INFANTIL V</MenuItem>
                        <MenuItem value="1º ANO">1º ANO</MenuItem>
                        <MenuItem value="2º ANO">2º ANO</MenuItem>
                        <MenuItem value="3º ANO">3º ANO</MenuItem>
                        <MenuItem value="4º ANO">4º ANO</MenuItem>
                        <MenuItem value="5º ANO">5º ANO</MenuItem>
                        <MenuItem value="6º ANO">6º ANO</MenuItem>
                        <MenuItem value="7º ANO">7º ANO</MenuItem>
                        <MenuItem value="8º ANO">8º ANO</MenuItem>
                        <MenuItem value="9º ANO">9º ANO</MenuItem>
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
              onClick={() => handleConfirmDelete(selectedItemId)}
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
