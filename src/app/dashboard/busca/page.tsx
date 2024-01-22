"use client";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/utils/api";
import CustomModal from "@/components/modal";
import { useUserContext } from "@/userContext";
import Unauthorized from "@/components/unauthorized";
import SearchIcon from "@mui/icons-material/Search";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";

export default function BuscaTurmas() {
  const router = useRouter();
  const [token, setToken] = useState("" as string | null);
  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const { user } = useUserContext();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [unidades, setUnidades] = useState<TUnidadeEscolar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TUnidadeEscolar | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (user.id) {
      const getDados = async () => {
        try {
          const response = await fetch(`${apiUrl}/v1/unidade?limit=200`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const responseJson = await response.json();
          console.log("entrou aq");
          setUnidades(responseJson);
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

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setToken(localToken);
  }, [token]);

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setTextFieldValue(event.target.value);
  // };

  const handleOptionChange = (
    event: React.ChangeEvent<{}>,
    value: TUnidadeEscolar | null
  ) => {
    setSelectedOption(value);
  };

  const handleClick = (id: string) => {
    router.push(`/dashboard/busca/${id}`);
  };

  if (user.role !== "admin") return <Unauthorized />;

  return (
    <Box margin="24px">
      <Grid container alignItems="center" flexDirection="column">
        <Grid item>
          <Typography variant="h3" marginBottom="12x" textAlign="center">
            Buscar turmas de Unidade de Ensino
          </Typography>
        </Grid>
        <Grid
          item
          marginTop="200px"
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap="24px"
        >
          {isLoading === false && (
            <Box marginTop={4}>
              <Autocomplete
                options={unidades}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Digite o nome da Unidade de Ensino"
                    variant="outlined"
                    onChange={(e) => setInputValue(e.target.value)}
                    sx={{ width: 500, backgroundColor: "#fff" }}
                  />
                )}
                value={selectedOption}
                onChange={handleOptionChange}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.nome}
                  </li>
                )}
              />
            </Box>
          )}
          {selectedOption && (
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              size="large"
              onClick={() => handleClick(selectedOption._id)}
            >
              Detalhar unidade
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
