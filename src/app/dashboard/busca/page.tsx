"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Container,
  DialogProps,
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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "@/userContext";
import { ptBR as corePtBR } from "@mui/material/locale";
import { apiUrl } from "@/utils/api";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Unauthorized from "@/components/unauthorized";
import SimpleBackdrop from "@/components/backdrop";

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
  createdAt: Date;
  updatedAt: Date;
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
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<
    TUnidadeEscolar | undefined
  >();
  const [selectedUnidadeId, setSelectedUnidadeId] = useState("");
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
    {
      field: "lastUpdate",
      headerName: "Última atualização",
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
      const response = await fetch(`${apiUrl}/unidade?limit=200`, {
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

  const getDadosUnidade = async (unidadeId: string) => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/unidade/${unidadeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnidadeSelecionada(data);
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

  const fetchTurmasId = async (unidadeId: string) => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/turma?unidadeId=${unidadeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedRows = data.results.map((turma: Turma) => ({
          ...turma,
          lastUpdate: new Date(turma.updatedAt).toLocaleString("pt-BR"),
        }));
        setRows(formattedRows);
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
    getDadosUnidade(unidadeId);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const exportTabela = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      format: "a4",
    });

    const currentDate = new Date();
    const formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const dateTime = `${formattedDate} ${formattedTime}`;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Relatório ${unidadeSelecionada?.nome}\nQuantitativos\nRelatório obtido em ${dateTime}`,
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

    doc.save(`relatorio_${unidadeSelecionada?.nome}.pdf`);
  };

  if (user.role === "user" || user.role === "adminUnidade")
    return <Unauthorized />;

  if (isLoading) {
    return <SimpleBackdrop open={isLoading} />;
  }

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
            <Box marginTop="16px" width="100%" maxWidth="800px" marginX="auto">
              <Box>
                {rows.length > 0 && (
                  <Button
                    startIcon={<PictureAsPdfIcon />}
                    size="large"
                    color="success"
                    variant="contained"
                    onClick={exportTabela}
                  >
                    Exportar tabela
                  </Button>
                )}

                <Typography margin="8px" variant="h5" textAlign="center">
                  {unidadeSelecionada?.nome} -{" "}
                  {rows.length > 0
                    ? "Quantitativo de alunos e professores por turma"
                    : "Não há turmas cadastradas na Unidade de Ensino"}
                </Typography>
              </Box>
              <ThemeProvider theme={theme}>
                {rows.length > 0 && (
                  <DataGrid
                    sx={{ backgroundColor: "#fff" }}
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
                )}
              </ThemeProvider>
            </Box>
          )}
        </Box>{" "}
      </Container>
    </Box>
  );
}
