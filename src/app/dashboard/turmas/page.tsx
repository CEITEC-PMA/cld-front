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
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";

export default function Turmas() {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
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
            onClick={(event) => console.log(event, params.row._id)}
            title="Editar"
          >
            <EditIcon />
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
              }}
            >
              <FormControl sx={{ mt: 2, minWidth: 120 }}>
                <InputLabel htmlFor="max-width">maxWidth</InputLabel>
                <Select
                  autoFocus
                  value={maxWidth}
                  label="Turma"
                  inputProps={{
                    name: "max-width",
                    id: "max-width",
                  }}
                >
                  <MenuItem value={false as any}>Selecione</MenuItem>
                  <MenuItem value="Infantil I">Infantil I</MenuItem>
                  <MenuItem value="Infantil I">Infantil II</MenuItem>
                  <MenuItem value="Infantil I">Infantil III</MenuItem>
                  <MenuItem value="Infantil I">Infantil IV</MenuItem>
                  <MenuItem value="Infantil I">Infantil V</MenuItem>
                  <MenuItem value="Infantil I">1º Ano</MenuItem>
                  <MenuItem value="Infantil I">2º Ano</MenuItem>
                  <MenuItem value="Infantil I">3º Ano</MenuItem>
                  <MenuItem value="Infantil I">4º Ano</MenuItem>
                  <MenuItem value="Infantil I">5º Ano</MenuItem>
                  <MenuItem value="Infantil I">6º Ano</MenuItem>
                  <MenuItem value="Infantil I">7º Ano</MenuItem>
                  <MenuItem value="Infantil I">8º Ano</MenuItem>
                  <MenuItem value="Infantil I">9º Ano</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={<Switch checked={fullWidth} />}
                label="Full width"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
