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
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { MouseEventHandler, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

export default function App() {
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { user } = useUserContext();

  const columns = [
    {
      name: "CPF/INEP",
      options: {
        align: "center",
        textAlign: "center",
      },
    },
    { name: "NOME", options: { filterOptions: { fullWidth: true } } },
    {
      name: "ATIVO",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const options = ["ATIVO", "INATIVO"];

          return (
            <Select value={value} onChange={(e) => updateValue(e.target.value)}>
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
      name: "PERFIL DO USUÁRIO",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const options = ["ADMIN", "USER"];

          return (
            <Select value={value} onChange={(e) => updateValue(e.target.value)}>
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
      name: "AÇÕES",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex];
          const userId = rowData[6];
          return (
            <div style={{ display: "flex", marginRight: "14px", gap: "6px" }}>
              <Tooltip title="Resetar senha do usuário">
                <IconButton
                  aria-label="delete"
                  color="warning"
                  onClick={() => handleResetarSenha(userId)}
                >
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Excluir usuário">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDeleteUsuario(userId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
      textAlign: "center",
    },
  ];

  const options = {
    search: searchBtn,
    download: false,
    print: false,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    // onTableChange: (action, state) => {
    //   console.log(action);
    //   console.dir(state);
    // },
    selectableRows: "none",
  };

  const handleResetarSenha = (id: string) => {
    console.log("Resetar Senha do Usuário com ID:", id);
    // Implemente a lógica de resetar a senha do usuário
  };

  const handleDeleteUsuario = (id: string) => {
    console.log("Excluir Usuário com ID:", id);
    // Implemente a lógica de exclusão do usuário
  };

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (user.id) {
      const getDados = async () => {
        try {
          const response = await fetch(`${apiUrl}/v1/users?limit=200`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const responseJson = await response.json();

          const updatedData = responseJson.results.map((user: TUser) => [
            user.username,
            user.nome,
            user.ativo ? "ATIVO" : "INATIVO",
            (user.role = user.role.toUpperCase()),
            user.acesso,
            user.deletado,
            user.id,
          ]);

          setData(updatedData);
          setIsLoading(false);
          return response;
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      };

      getDados();
    }
  }, [user.id]);

  console.log(data);
  console.log(typeof data);

  return (
    <Box margin="24px">
      <Container>
        <SimpleBackdrop open={isLoading} />
        <Typography variant="h3" marginBottom="12x" textAlign="center">
          Lista de usuários
        </Typography>

        <Grid container spacing={2} justifyContent="center" marginTop="4px">
          {isLoading ? (
            "Carregando"
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
        </Grid>
      </Container>
    </Box>
  );
}
