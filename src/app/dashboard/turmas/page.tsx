"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
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
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import { useUserContext } from "@/userContext";

type FormData = {
  selectedTurma: string;
  qtdeAlunos: number | null;
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

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    null
  );
  const [rows, setRows] = useState("");

  const columns: GridColDef[] = [
    {
      field: "turma",
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
            onClick={() => handleEditar(params.row._id)}
            title="Editar"
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleDeletar(params.row._id)}
            title="Remover"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // const rows = [
  //   { _id: 1, turma: "Infantil I", qtdeAlunos: 20 },
  //   { _id: 2, turma: "Infantil II", qtdeAlunos: 45 },
  //   { _id: 3, turma: "Infantil III", qtdeAlunos: 30 },
  // ];

  useEffect(() => {
    fetch("/api/v1/turmas") // Substitua pela rota correta do seu backend
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) =>
        console.error("Erro ao obter dados do backend:", error)
      );
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    reset();
    setSelectedItemId(null);
    setIsModalOpen(false);
  };

  const handleSave: SubmitHandler<FormData> = (data) => {
    const { selectedTurma, qtdeAlunos } = data;

    fetch("/api/v1/turmas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        turma: selectedTurma,
        qtdeAlunos: qtdeAlunos,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(data);
        console.log("Sucesso:", result);
        reset();
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  const handleEditar = (id: string) => {
    setSelectedItemId(id);
    setIsModalOpen(true);
  };

  const handleDeletar = (id: string) => {
    console.log("Deletou:", id);
  };

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h3" marginBottom="12px" textAlign="center">
          Lista de Turmas - {user.nome}
        </Typography>

        <Box marginTop="8px" width="100%" maxWidth="800px" marginX="auto">
          <Button
            startIcon={<AddCircleIcon />}
            size="large"
            variant="contained"
            onClick={openModal}
          >
            Adicionar turma
          </Button>

          <Box marginTop="16px" width="100%" maxWidth="800px" marginX="auto">
            <DataGrid
              getRowId={(row) => row._id}
              rows={rows}
              columns={columns}
              autoHeight
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={isModalOpen}
          onClose={handleClose}
        >
          <DialogTitle>Adicionar nova turma</DialogTitle>
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
                <FormControl sx={{ mt: 4, minWidth: 120 }}>
                  <InputLabel htmlFor="turma">Turma</InputLabel>
                  <Controller
                    name="selectedTurma"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field}>
                        <MenuItem value="Infantil I">Infantil I</MenuItem>
                        <MenuItem value="Infantil II">Infantil II</MenuItem>
                        <MenuItem value="Infantil III">Infantil III</MenuItem>
                        <MenuItem value="Infantil IV">Infantil IV</MenuItem>
                        <MenuItem value="Infantil V">Infantil V</MenuItem>
                        <MenuItem value="1º Ano">1º Ano</MenuItem>
                        <MenuItem value="2º Ano">2º Ano</MenuItem>
                        <MenuItem value="3º Ano">3º Ano</MenuItem>
                        <MenuItem value="4º Ano">4º Ano</MenuItem>
                        <MenuItem value="5º Ano">5º Ano</MenuItem>
                        <MenuItem value="6º Ano">6º Ano</MenuItem>
                        <MenuItem value="7º Ano">7º Ano</MenuItem>
                        <MenuItem value="8º Ano">8º Ano</MenuItem>
                        <MenuItem value="9º Ano">9º Ano</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormControl sx={{ mt: 4 }}>
                  <Controller
                    name="qtdeAlunos"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quantidade de Alunos"
                        variant="outlined"
                        type="number"
                      />
                    )}
                  />
                </FormControl>
              </Box>
              <DialogActions sx={{ mt: 2 }}>
                <Button
                  startIcon={<CheckIcon />}
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  Salvar
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
      </Container>
    </Box>
  );
}
