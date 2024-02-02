"use client";
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
import React, { useEffect, useState } from "react";

import Unauthorized from "@/components/unauthorized";
import { useUserContext } from "@/userContext";
import { apiUrl } from "@/utils/api";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { ptBR as corePtBR } from "@mui/material/locale";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "next/navigation";
import SimpleBackdrop from "@/components/backdrop";

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
        primary: { main: "#0F4C81" },
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
    const doc = new jsPDF({
      orientation: "portrait",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Relatório Geral - Quantitativos Totais\nSEMED 2024",
      doc.internal.pageSize.width / 2,
      15,
      {
        align: "center",
      }
    );

    const sortedRows = [...rows].sort((a, b) =>
      a.nameTurma.localeCompare(b.nameTurma)
    );

    const tableWidth = doc.internal.pageSize.width - 40;
    const startX = (doc.internal.pageSize.width - tableWidth) / 2;
    const startY = 30;

    const tableSettings = {
      head: [columns.map((column) => column.headerName)],
      body: sortedRows.map((row) =>
        columns.map((column) => row[column.field].toString())
      ),
      startY: startY,
      margin: { left: startX, right: startX },
      tableWidth: "auto",
      styles: {
        cellPadding: 2,
        fontSize: 12,
        halign: "center",
      },
      headStyles: {
        fillColor: [15, 76, 129],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    };

    doc.autoTable(tableSettings);

    doc.save("relatorio_geral.pdf");
  };

  if (user.role === "user" || user.role === "adminUnidade")
    return <Unauthorized />;

  if (isLoading) {
    return <SimpleBackdrop open={isLoading} />;
  }

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
              Relatório Geral - SEMED 2024
            </Typography>
            <Box marginTop="8px" width="100%" maxWidth="800px" marginX="auto">
              <Box display="flex" justifyContent="space-between">
                {rows.length > 0 && (
                  <>
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
                  </>
                )}
              </Box>
              <Box
                marginTop="16px"
                width="100%"
                maxWidth="800px"
                marginX="auto"
                sx={{ backgroundColor: "#fff" }}
              >
                {rows.length > 0 ? (
                  <>
                    <Typography
                      variant="h5"
                      marginBottom="6px"
                      textAlign="center"
                    >
                      Quantidades Totais
                    </Typography>
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
                        pageSizeOptions={[5, 10]}
                        localeText={
                          ptBR?.components?.MuiDataGrid?.defaultProps.localeText
                        }
                        disableRowSelectionOnClick
                      />
                    </ThemeProvider>
                  </>
                ) : (
                  <Typography variant="h6" textAlign="center">
                    Não há turmas cadastradas
                  </Typography>
                )}
              </Box>
            </Box>{" "}
          </>
        )}
      </Container>
    </Box>
  );
}
