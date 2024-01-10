"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Backdrop,
  Box,
  Container,
  DialogProps,
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
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "@/userContext";
import { ptBR as corePtBR } from "@mui/material/locale";
import { apiUrl } from "@/utils/api";
import Unauthorized from "@/components/unauthorized";

type Turma = {
  _id: string;
  nomeTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
};

interface Zona {
  inep: string;
  nome: string;
  _id: string;
}

export default function TurmaDetalhe({ params }: { params: { id: string } }) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");

  const { user } = useUserContext();

  const [rows, setRows] = useState<readonly Turma[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = params;
  const [zona, setZona] = useState<Zona | null>(null);
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
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const getDadosZona = async () => {
      const response = await fetch(`${apiUrl}/api/v1/zona/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseJson = await response.json();
      setZona(responseJson.zona);
      setIsLoading(false);
    };
    getDadosZona();
  }, [id]);

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
              Detalhamento de Turmas
            </Typography>
            <Typography variant="h5" marginBottom="6px" textAlign="center">
              Gerenciamento - {zona?.nome}
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
