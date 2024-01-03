"use client";
import { useUserContext } from "@/userContext";
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
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { MouseEvent, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Turmas() {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
  const [selectedTurma, setSelectedTurma] = React.useState<string>("");
  const [qtdeAlunos, setQtdeAlunos] = React.useState<number | null>(null);

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
            onClick={(event) => handleEditar(event, params.row._id)}
            title="Editar"
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={(event) => handleDeletar(event, params.row._id)}
            title="Remover"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = [
    { _id: 1, turma: "Infantil I", qtdeAlunos: 20 },
    { _id: 2, turma: "Infantil II", qtdeAlunos: 45 },
    { _id: 3, turma: "Infantil III", qtdeAlunos: 30 },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    console.log("Turma selecionada:", selectedTurma);
    console.log("Quantidade de alunos:", qtdeAlunos);
    setIsModalOpen(false);
  };

  const handleEditar = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    setIsModalOpen(true);
  };

  const handleDeletar = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    console.log("deletou");
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

          <Box marginTop="8px" width="100%" maxWidth="800px" marginX="auto">
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
            <Box
              noValidate
              component="form"
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
                <Select
                  value={selectedTurma}
                  label="Turma"
                  onChange={(e) => setSelectedTurma(e.target.value as string)}
                >
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
              </FormControl>
              <FormControl sx={{ mt: 4 }}>
                <TextField
                  label="Quantidade de Alunos"
                  variant="outlined"
                  type="number"
                  id="qtdeAlunos"
                  value={qtdeAlunos ?? ""}
                  onChange={(e) =>
                    setQtdeAlunos(parseInt(e.target.value, 10) || null)
                  }
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ mb: 1, mr: 1 }}>
            <Button variant="contained" color="success" onClick={handleSave}>
              Salvar
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
