import { apiUrl } from "@/utils/api";
import { TUser } from "@/utils/types/user.types";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import createCache from "@emotion/cache";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";

type TUsuarioModulacao = {
  user: TUser;
  open: boolean;
  onClose: () => void;
};

type TUnidades = {
  id: string;
  nome: string;
};

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function UsuarioModulacao({
  user,
  open,
  onClose,
}: TUsuarioModulacao) {
  const userSelecionado = user;
  const [isLoading, setIsLoading] = useState(false);
  const [unidades, setUnidades] = useState<TUnidades[]>([] || undefined);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState("");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [userUnidadesId, setUserUnidadesId] = useState<string[]>([]);
  const [autocompleteValue, setAutocompleteValue] = useState<TUnidades | null>(
    null
  );

  const columns = [
    {
      name: "nome",
      label: "NOME",
      options: { textAlign: "center", filterOptions: { fullWidth: true } },
    },
    {
      name: "acoes",
      label: "AÇÕES",
      options: {
        textAlign: "center",
        customBodyRender: (value, tableMeta) => {
          const rowData = unidadesFiltradas[tableMeta.rowIndex];
          return (
            <div style={{ display: "flex", gap: "6px" }}>
              <Tooltip title="Remover modulação">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleRemoveUnidadeId(rowData)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    search: searchBtn,
    download: false,
    print: false,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight,
    tableBodyMaxHeight,
    // onTableChange: (action, state) => {
    //   console.log(action);
    //   console.dir(state);
    // },
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Desculpe, nenhum registro encontrado",
        toolTip: "Classificar",
      },
      pagination: {
        next: "Próxima Página",
        previous: "Página Anterior",
        rowsPerPage: "Linhas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Pesquisar",
        downloadCsv: "Download CSV",
        print: "Imprimir",
        viewColumns: "Ver Colunas",
        filterTable: "Filtrar Tabela",
      },
      filter: {
        all: "Todos",
        title: "FILTROS",
        reset: "REDEFINIR",
      },
      viewColumns: {
        title: "Mostrar Colunas",
        titleAria: "Mostrar/Esconder Colunas da Tabela",
      },
      selectedRows: {
        text: "linha(s) selecionada(s)",
        delete: "Excluir",
        deleteAria: "Excluir linhas selecionadas",
      },
    },
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (userSelecionado.unidadeId) {
      setUserUnidadesId(userSelecionado.unidadeId);
    }
    fetchUnidades();
  }, [userSelecionado.unidadeId]);

  useEffect(() => {
    setAutocompleteValue(null);
  }, [userUnidadesId]);

  const unidadesFiltradas = unidades.filter((unidade) =>
    userUnidadesId.includes(unidade.id)
  );

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    setIsLoading(true);
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
        setIsLoading(false);
      } else {
        console.error("Erro ao obter dados das unidades do backend.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro durante a busca de unidades:", error);
      setIsLoading(false);
    }
  };

  const handleUnidadeAdd = async (unidadeId: string) => {
    setSelectedUnidadeId(unidadeId);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/v1/users/modular/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ unidadeId: unidadeId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Atualizar o estado local userUnidadesId com o novo array
        setUserUnidadesId([...userUnidadesId, unidadeId]);
        console.log(`Usuário ${user.nome} modulado com sucesso!`);

        // Limpar a seleção do Autocomplete
        setAutocompleteValue(null);
      } else {
        console.error("Falha ao alterar o status do usuário");
      }
    } catch (error) {
      console.error("A solicitação não foi concluída, erro no envio dos dados");
    }
    setIsLoading(false);
  };

  const handleRemoveUnidadeId = async (rowData: TUnidadeEscolar) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/v1/users/modular/${user.id}`, {
        method: "DELETE",
        body: JSON.stringify({ unidadeId: rowData.id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Atualizar o estado local userUnidadesId com o novo array
        console.log(
          `Usuário ${user.nome} desmodulado da unidade ${rowData.nome} com sucesso!`
        );

        // Limpar a seleção do Autocomplete
        setAutocompleteValue(null);
      } else {
        console.error("Falha ao alterar o status do usuário");
      }
    } catch (error) {
      console.error("A solicitação não foi concluída, erro no envio dos dados");
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <Grid container spacing={2} justifyContent="center" padding={3}>
        <DialogTitle>Modulação do usuário</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para modular o usuário em uma Unidade de Ensino selecione na lista
            abaixo
          </DialogContentText>
          <Autocomplete
            id="selectUnidade"
            options={unidades}
            value={autocompleteValue}
            sx={{
              margin: "16px 0",
              textAlign: "center",
              backgroundColor: "#fff",
              minWidth: "65%",
            }}
            getOptionLabel={(option) => option.nome}
            onChange={(_, newValue) => {
              setAutocompleteValue(newValue);
              handleUnidadeAdd(newValue?.id || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecione a Unidade"
                fullWidth
                sx={{}}
              />
            )}
          />
          {isLoading ? (
            "Carregando"
          ) : (
            <CacheProvider value={muiCache}>
              <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                  title="Unidades de Ensino onde o usuário está modulado"
                  data={unidadesFiltradas}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            </CacheProvider>
          )}
          {/* <List>
            {unidadesFiltradas.map((unidade, index) => (
              <ListItem key={index}>
                <ListItemText primary={unidade.nome} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRemoveUnidadeId}
                >
                  Remover
                </Button>
              </ListItem>
            ))}
          </List> */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions> */}
      </Grid>
    </Dialog>
  );
}
