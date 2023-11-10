import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CandidatoCard from "../candidatoCard";
import { useUserContext } from "@/userContext";
import { Candidato } from "@/utils/types/candidato.types";
import { apiUrl } from "@/utils/api";

export default function EscolhaCandidato({
  avancarEtapa,
  voltarEtapa,
}: {
  avancarEtapa: () => void;
  voltarEtapa: () => void;
}) {
  const { user } = useUserContext();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [candidatoEscolhido, setCandidatoEscolhido] = useState("");

  useEffect(() => {
    const digitou = new Audio(
      "https://api.anapolis.go.gov.br/apiupload/sed/digito.mp3"
    );

    const tecla1 = () => {
      digitou.play();
      setCandidatoEscolhido("1");
    };
    const tecla2 = () => {
      digitou.play();
      setCandidatoEscolhido("2");
    };
    const tecla3 = () => {
      digitou.play();
      setCandidatoEscolhido("3");
    };
    const tecla4 = () => {
      digitou.play();
      setCandidatoEscolhido("4");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "1":
          tecla1();
          break;
        case "2":
          tecla2();
          break;
        case "3":
          tecla3();
          break;
        case "4":
          tecla4();
          break;
        case "Enter":
          digitou.play();
          setTimeout(() => {
            avancarEtapa();
          }, 500);
          break;
        // Add additional cases if needed
        default:
          // If another key is pressed, do nothing
          break;
      }
    };

    // Attach the event listener to the window object
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [avancarEtapa]);

  useEffect(() => {
    //fetch
    const token = localStorage.getItem("token");
    if (user._id) {
      const getDadosCandidatos = async () => {
        const response = await fetch(
          `${apiUrl}/api/v1/candidato/candidatoZona/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseJson = await response.json();
        setCandidatos(responseJson.candidatos);
      };
      getDadosCandidatos();
    }
  }, [user._id]);

  console.log(candidatos);

  return (
    <Box margin="0" padding="0" height={`calc(100vh - 66px)`} overflow="hidden">
      <Typography
        variant={smDown ? "h6" : mdDown ? "h5" : "h4"}
        textAlign="center"
        marginTop={2}
        color=" #0f4c81"
      >
        ELEIÇÕES MUNICIPAIS DE DIRETORES BIÊNIO 2024/25 - {user.nome}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={6}
        alignItems="center"
        justifyContent="flex-start"
        height="100%"
      >
        <Typography variant="h4" textAlign="center" marginTop={5} color=" #000">
          Digite o número correspondente e depois tecle ENTER para prosseguir
        </Typography>
        <Box>
          <Grid container spacing={2} justifyContent="center">
            {candidatos.map((candidato, i) => {
              let cpfSemTraco = candidato?.cpf;
              if (cpfSemTraco) {
                cpfSemTraco = cpfSemTraco.replace(".", "");
                cpfSemTraco = cpfSemTraco.replace(".", "");
                cpfSemTraco = cpfSemTraco.replace("-", "");
              }

              const nomes = candidato?.nome?.toUpperCase()?.trim()?.split(" ");
              const nomeCortado = nomes.slice(0, 2).join(" ");

              return (
                <Grid item xs={2.5} md={2.5} lg={2.5} key={i}>
                  <CandidatoCard
                    image={`https://api.anapolis.go.gov.br/apieleicao/fotosCandidato/${cpfSemTraco}/${candidato.foto}`}
                    numero="1"
                    nome={nomeCortado}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box>
          EscolhaCandidato
          <Button
            style={{ whiteSpace: "nowrap" }}
            size="large"
            onClick={voltarEtapa}
          >
            Voltar
          </Button>
          <Button
            style={{ whiteSpace: "nowrap" }}
            size="large"
            onClick={avancarEtapa}
          >
            Avançar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
