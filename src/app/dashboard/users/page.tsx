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
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";

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
    { name: "Nome", options: { filterOptions: { fullWidth: true } } },
    "CPF/INEP",
    "Ativo",
    {
      name: "Perfil do usuário",
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
    "Ações",
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
            user.nome,
            user.username,
            user.ativo ? "Ativo" : "Inativo",
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
        <SimpleBackdrop open={isLoading} />
      </Container>
    </Box>
  );
}
