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
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/utils/api";
import CustomModal from "@/components/modal";
import { useUserContext } from "@/userContext";
import Unauthorized from "@/components/unauthorized";
import { TUser } from "@/utils/types/user.types";

export default function Settings() {
  const router = useRouter();
  const [token, setToken] = useState("" as string | null);
  const [textFieldValue, setTextFieldValue] = useState<string>("");

  const { user } = useUserContext();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [users, setUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TUser | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(user.id);

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
          setUsers(responseJson.results);
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

  console.log(users);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setToken(localToken);
  }, [token]);

  const handleReset = async (inep: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/zona/inep`, {
        method: "PUT",
        body: JSON.stringify({ inep: selectedOption?.inep }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Senha redefinida com sucesso!");
        router.push("/dashboard");
      } else {
        alert("Não foi possível redefinir a senha!");
      }
    } catch (error) {
      console.error("Ocorreu um erro na solicitação:", error);
      alert("Ocorreu um erro na solicitação");
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value);
  };

  const handleOptionChange = (
    event: React.ChangeEvent<{}>,
    value: TUser | null
  ) => {
    setSelectedOption(value);
  };

  if (user.role !== "admin") return <Unauthorized />;

  return (
    <Box margin="24px">
      <Grid container alignItems="center" flexDirection="column">
        <Grid item>
          <Typography variant="h3" marginBottom="12x" textAlign="center">
            Redefinição de senha de usuário
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
                options={users}
                getOptionLabel={(option) => option.nome}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Digite o nome do usuário"
                    variant="outlined"
                    onChange={(e) => setInputValue(e.target.value)}
                    sx={{ width: 500, backgroundColor: "#fff" }}
                  />
                )}
                value={selectedOption}
                onChange={handleOptionChange}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.nome}
                  </li>
                )}
              />
            </Box>
          )}
          {selectedOption && (
            <Button
              variant="contained"
              startIcon={<RotateLeftIcon />}
              size="large"
              onClick={() => openModal()}
            >
              Resetar senha
            </Button>
          )}
          <CustomModal
            open={isModalOpen}
            title="Atenção!"
            description={`Confirma o reset de senha da unidade ${selectedOption?.nome}?`}
            onClose={closeModal}
            yesButtonLabel="Sim"
            noButtonLabel="Não"
            onYesButtonClick={() => handleReset(textFieldValue)}
            onNoButtonClick={closeModal}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
