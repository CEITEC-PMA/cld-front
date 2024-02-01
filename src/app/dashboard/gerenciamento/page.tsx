"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Backdrop,
  Box,
  Button,
  Container,
  DialogProps,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel, ptBR } from "@mui/x-data-grid";

import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "@/userContext";
import { ptBR as corePtBR } from "@mui/material/locale";
import { apiUrl } from "@/utils/api";
import Unauthorized from "@/components/unauthorized";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useRouter } from "next/navigation";

type FormData = {
  selectedTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
};

type Turma = {
  id: string;
  nameTurma: string;
  qtdeAlunos: number | null;
  qtdeProf: number | null;
  unidadeId: string[];
};

export default function TurmasTotais() {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");

  const { user } = useUserContext();
  const [rows, setRows] = useState<readonly Turma[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "nameTurma", sort: "asc" },
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
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/turma?limit=10000`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const aggregatedRows = aggregateTurmas(data.results);
        setRows(aggregatedRows);
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

  const aggregateTurmas = (turmas: Turma[]) => {
    const turmasAggregated = {};

    turmas.forEach((turma: Turma) => {
      const nameTurma = turma.nameTurma;
      if (!turmasAggregated[nameTurma]) {
        turmasAggregated[nameTurma] = {
          id: nameTurma,
          nameTurma,
          qtdeAlunos: 0,
          qtdeProf: 0,
        };
      }

      turmasAggregated[nameTurma].qtdeAlunos += turma.qtdeAlunos || 0;
      turmasAggregated[nameTurma].qtdeProf += turma.qtdeProf || 0;
    });

    const aggregatedRows = Object.values(turmasAggregated);

    return aggregatedRows;
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const handleSearch = () => {
    router.push("/dashboard/busca");
  };

  const exportTabela = () => {
    console.log("clicou");
  };

  if (user.role !== "admin") return <Unauthorized />;

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
              Relatório Geral
            </Typography>
            <Box marginTop="8px" width="100%" maxWidth="800px" marginX="auto">
              <Box display="flex" justifyContent="space-between">
                <Button
                  size="large"
                  startIcon={<SearchIcon />}
                  variant="contained"
                  onClick={handleSearch}
                >
                  Detalhar unidade
                </Button>
                <Button
                  startIcon={<PictureAsPdfIcon />}
                  size="large"
                  color="success"
                  variant="contained"
                  onClick={exportTabela}
                >
                  Exportar tabela
                </Button>
              </Box>
              <Box
                marginTop="16px"
                width="100%"
                maxWidth="800px"
                marginX="auto"
                sx={{ backgroundColor: "#fff" }}
              >
                <Typography variant="h5" marginBottom="6px" textAlign="center">
                  Quantidades Totais
                </Typography>
                {rows.length > 0 ? (
                  <ThemeProvider theme={theme}>
                    <DataGrid
                      getRowId={(row) => row.id}
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
                ) : (
                  <Typography variant="h6" textAlign="center">
                    Não há turmas cadastradas
                  </Typography>
                )}
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
