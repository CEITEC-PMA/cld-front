"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Autocomplete,
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
      const response = await fetch(`${apiUrl}/v1/unidade?limit=200`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data.results);
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

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h3" marginBottom="8px" textAlign="center">
          Detalhamento de Unidade - Lista de Turmas
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
            sx={{ minWidth: "200px" }}
          >
            <Autocomplete
              id="selectUnidade"
              options={unidades}
              value={
                unidades.find((unidade) => unidade.id === selectedUnidadeId) ||
                null
              }
              sx={{
                textAlign: "center",
                backgroundColor: "#fff",
                minWidth: "65%",
              }}
              getOptionLabel={(option) => option.nome}
              onChange={(_, newValue) =>
                handleUnidadeChange(newValue?.id || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecione a Unidade"
                  fullWidth
                  sx={{}}
                />
              )}
            />
          </Box>

          {selectedUnidadeId && (
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
          )}
        </Box>{" "}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Box>
  );
}
