"use client";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
  ptBR,
} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import React, { MouseEvent, useEffect, useState } from "react";
import { useUserContext } from "@/userContext";
import { apiUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import CreateIcon from "@mui/icons-material/Create";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ptBR as corePtBR } from "@mui/material/locale";

export default function ListaUnidades() {
  const { user } = useUserContext();

  const router = useRouter();
  const [unidades, setUnidades] = useState<TUnidadeEscolar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "nome", sort: "asc" },
  ]);

  const columns: GridColDef[] = [
    {
      field: "inep",
      headerName: "INEP",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome",
      headerName: "Nome completo",
      width: 400,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div>
            <IconButton
              color="primary"
              onClick={(event) => handleEditar(event, params.row.id)}
              title="Editar unidade"
            >
              <CreateIcon />
            </IconButton>
          </div>
        );
      },
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

  const handleEditar = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    router.push(`/dashboard/unidades/edit/${id}`);
  };

  const handleCreate = () => {
    router.push(`/dashboard/unidades/edit`);
  };

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (user.id) {
      const getDadosUnidades = async () => {
        const response = await fetch(`${apiUrl}/unidade?limit=200`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseJson = await response.json();
        setUnidades(responseJson.results);
        setIsLoading(false);
      };
      getDadosUnidades();
    }
  }, [user.id]);

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h3" marginBottom="12x" textAlign="center">
          Lista de Unidades
        </Typography>

        <Grid container spacing={2} justifyContent="center" marginTop="4px">
          <Grid item xs={12} md={8} lg={7}>
            <Button
              variant="contained"
              onClick={handleCreate}
              startIcon={<AddCircleIcon />}
            >
              Adicionar unidade
            </Button>
            <ThemeProvider theme={theme}>
              <DataGrid
                sx={{ backgroundColor: "#fff", mt: 2 }}
                getRowId={(row) => row.id}
                rows={unidades}
                columns={columns}
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
              />
            </ThemeProvider>
          </Grid>
        </Grid>

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
