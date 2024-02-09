"use client";
import SimpleBackdrop from "@/components/backdrop";
import { useUserContext } from "@/userContext";
import { apiUrl } from "@/utils/api";
import { TUser } from "@/utils/types/user.types";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { MouseEventHandler, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CustomModal from "@/components/modal";
import { useRouter } from "next/navigation";
import UsuarioModulacao from "@/components/modulacao";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function App() {
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showUsuarioModulacao, setShowUsuarioModulacao] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser>();
  const [data, setData] = useState<TUser[]>([]);
  const [reloadData, setReloadData] = useState(false);
  const { user } = useUserContext();
  const [deletadoToggles, setDeletadoToggles] = useState<boolean[]>([]);
  const router = useRouter();

  const columns = [
    {
      name: "username",
      label: "CPF/INEP",
      options: {
        align: "center",
        textAlign: "center",
      },
    },
    {
      name: "nome",
      label: "NOME",
      options: { textAlign: "center", filterOptions: { fullWidth: true } },
    },
    {
      name: "ativo",
      label: "ATIVO",
      options: {
        textAlign: "center",
        customBodyRender: (value, tableMeta, updateValue) => {
          const isActive = value === "ATIVO";
          const backgroundColor = isActive ? "#4caf50" : "#f44336";

          return (
            <div
              style={{
                fontSize: "12px",
                backgroundColor,
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "default",
                textAlign: "center",
              }}
            >
              {value}
            </div>
          );
        },
      },
    },
    {
      name: "role",
      label: "PERFIL DO USUÁRIO",
      options: {
        textAlign: "center",
        customBodyRender: (value, tableMeta, updateValue) => {
          const options = ["admin", "user", "adminUnidade", "adminAnalista"];

          return (
            <Select
              value={value}
              onChange={(e) => {
                updateValue(e.target.value);
                handleChangeRole(e.target.value, data[tableMeta.rowIndex].id);
              }}
              style={{ fontSize: "12px" }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },
    },
    {
      name: "acoes",
      label: "AÇÕES",
      options: {
        textAlign: "center",
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex];
          return (
            <div style={{ display: "flex", marginRight: "14px", gap: "6px" }}>
              <Tooltip title="Modulação do usuário">
                <IconButton
                  aria-label=""
                  color="primary"
                  onClick={() => handleDetalharUnidadesModulado(rowData)}
                >
                  <ApartmentIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Resetar senha do usuário">
                <IconButton
                  aria-label="reset"
                  color="warning"
                  onClick={() => handleResetarSenha(rowData)}
                >
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Excluir usuário">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDeleteUsuario(rowData)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip> */}
            </div>
          );
        },
      },
    },
    {
      name: "deletado",
      label: "DISPONÍVEL",
      options: {
        align: "center",
        textAlign: "center",
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;

          return (
            <ToggleButton
              value="check"
              selected={deletadoToggles[rowIndex] || false}
              onChange={() => handleToggle(rowIndex)}
            >
              {value}
            </ToggleButton>
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${apiUrl}/users?limit=200`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseJson = await response.json();

        const updatedData = responseJson.results.map((user: any) => ({
          ...user,
          ativo: user.ativo ? "ATIVO" : "INATIVO",
          role: user.role,
          deletado: user.deletado ? "NÃO" : "SIM",
        }));

        setData(updatedData);

        const initialToggleState = updatedData.map(
          (user) => user.deletado === "SIM"
        );
        setDeletadoToggles(initialToggleState);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    if (!showUsuarioModulacao) {
      fetchData();
    }
  }, [user.id, reloadData, showUsuarioModulacao]);

  // const handleChangeAtivo = async (value: string, userId: string) => {
  //   setIsLoading(true);
  //   const token = localStorage.getItem("token");
  //   console.log("entrou no handleChangeAtivo");

  //   try {
  //     const response = await fetch(`${apiUrl}/users/${userId}`, {
  //       method: "PATCH",
  //       body: JSON.stringify({ ativo: value === "ATIVO" ? true : false }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       // Lógica adicional se necessário
  //       console.log(`Status do usuário ${userId} alterado para ${value}`);
  //       setIsLoading(false);
  //     } else {
  //       console.error("Falha ao alterar o status do usuário");
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao realizar a solicitação:", error);
  //     setIsLoading(false);
  //   }
  // };

  const handleChangeRole = async (value: string, userId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: value.toLowerCase() }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Lógica adicional se necessário
        console.log(`Perfil do usuário ${userId} alterado para ${value}`);
      } else {
        console.error("Falha ao alterar o perfil do usuário");
      }
    } catch (error) {
      console.error("Erro ao realizar a solicitação:", error);
    }
  };

  const handleDetalharUnidadesModulado = (rowData: TUser) => {
    setSelectedUser(rowData);
    setShowUsuarioModulacao(true);
  };

  const handleResetarSenha = (rowData: TUser) => {
    const userId = rowData.id;
    setSelectedUser(rowData);
    setIsResetModalOpen(true);
  };

  const closeModal = () => {
    setIsResetModalOpen(false);
  };

  const handleReset = async (rowData: TUser) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}/users/${rowData?.id}`, {
        method: "PUT",
        body: JSON.stringify({ acesso: 0 }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert(`Senha do usuário ${rowData.nome} redefinida com sucesso!`);
        closeModal();
      } else {
        alert("Não foi possível redefinir a senha!");
      }
    } catch (error) {
      console.error("Ocorreu um erro na solicitação:", error);
      alert("Ocorreu um erro na solicitação");
    }
  };

  const handleToggle = (rowIndex) => {
    // Atualiza o estado do ToggleButton com base no índice da linha
    const newToggleState = [...deletadoToggles];
    newToggleState[rowIndex] = !newToggleState[rowIndex];
    setDeletadoToggles(newToggleState);

    const userId = data[rowIndex].id;
    const newValue = newToggleState[rowIndex] ? "NÃO" : "SIM";
    updateDeletado(userId, newValue);
  };

  const updateDeletado = async (userId, newValue) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "DELETE",
        body: JSON.stringify({ deletado: newValue === "NÃO" ? false : true }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Lógica adicional se necessário
        console.log(
          `Status de deletado do usuário ${userId} alterado para ${newValue}`
        );
      } else {
        console.error("Falha ao alterar o status de deletado do usuário");
      }
    } catch (error) {
      console.error("Erro ao realizar a solicitação:", error);
    }
  };

  return (
    <Box margin="24px">
      <Container>
        <SimpleBackdrop open={isLoading} />
        <Typography variant="h3" marginBottom="12x" textAlign="center">
          Lista de usuários
        </Typography>

        <Grid container spacing={2} justifyContent="center" marginTop="4px">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <CacheProvider value={muiCache}>
              <ThemeProvider theme={createTheme()}>
                <MUIDataTable
                  title="Lista de usuários"
                  data={data}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            </CacheProvider>
          )}
          {showUsuarioModulacao && selectedUser && (
            <UsuarioModulacao
              user={selectedUser}
              open={showUsuarioModulacao}
              onClose={() => {
                setShowUsuarioModulacao(false);
              }}
            />
          )}
          {selectedUser && (
            <CustomModal
              open={isResetModalOpen}
              title="Atenção!"
              description={`Confirma o reset de senha do usuário ${selectedUser?.nome}?`}
              onClose={closeModal}
              yesButtonLabel="Sim"
              noButtonLabel="Não"
              onYesButtonClick={() => handleReset(selectedUser)}
              onNoButtonClick={closeModal}
            />
          )}
        </Grid>
      </Container>
    </Box>
  );
}
