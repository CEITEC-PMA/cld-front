"use client";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Container, Typography } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { useUserContext } from "@/userContext";
import { apiUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import ThreePIcon from "@mui/icons-material/ThreeP";
import ArticleIcon from "@mui/icons-material/Article";
import CustomModal from "@/components/modal";
import CreateIcon from "@mui/icons-material/Create";
import { TUnidadeEscolar } from "@/utils/types/unidade.types";
import AddIcon from "@mui/icons-material/Add";

export default function ListaUnidades() {
  const { user } = useUserContext();

  const router = useRouter();
  const [unidades, setUnidades] = useState<TUnidadeEscolar[]>([]);

  const columns: GridColDef[] = [
    {
      field: "inep",
      headerName: "INEP",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome",
      headerName: "Nome completo",
      width: 400,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        // const aprovado = params.row.aprovado;
        return (
          <div>
            <IconButton
              color="primary"
              onClick={(event) => handleEditar(event, params.row.id)}
              title="Documentação do candidato"
            >
              <CreateIcon />
            </IconButton>

            {/* <IconButton
              color="primary"
              onClick={(event) => handleDeletar(event, params.row._id)}
              title="Remover"
            >
              <DeleteIcon />
            </IconButton> */}

            {/* {aprovado === "Indeferida" && (
              <IconButton
                color="error"
                onClick={(event) => handleRecorrer(event, params.row._id)}
                title="Recurso do candidato"
              >
                <ThreePIcon />
              </IconButton>
            )}

            {aprovado === "Indeferida" && (
              <IconButton
                color="warning"
                onClick={(event) =>
                  handleRespostaComissao(event, params.row.respostaComissao2)
                }
                title="Resposta da Comissão Eleitoral Municipal ao recurso"
              >
                <ArticleIcon />
              </IconButton>
            )} */}

            {/* {user.role?.includes("super-adm") && (
              <IconButton
                color="primary"
                onClick={(event) => handleValidar(event, params.row._id)}
                title="Analisar"
              >
                <CheckCircleIcon />
              </IconButton>
            )} */}
          </div>
        );
      },
    },
  ];

  const handleDetalhar = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    router.push(`/dashboard/candidato/register/${id}`);
  };

  const handleEditar = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    console.log(id);
    router.push(`/dashboard/unidades/edit?id=${id}`);
  };

  // const handleRecorrer = (
  //   event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  //   id: string
  // ) => {
  //   event.stopPropagation();
  //   console.log(id);
  //   router.push(`/dashboard/candidato/recurso/${id}`);
  // };

  // const handleDeletar = async (
  //   event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  //   id: string
  // ) => {
  //   event.stopPropagation();

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${apiUrl}/api/v1/candidato/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const updatedCandidatos = candidatos.filter(
  //         (candidato) => candidato._id !== id
  //       );
  //       console.log("deletado");
  //       setCandidatos(updatedCandidatos);
  //     } else {
  //       console.error("Erro ao excluir candidato. Else!!!!");
  //     }
  //   } catch (error) {
  //     console.error("Erro ao excluir candidato:", error);
  //   }
  // };

  // const handleValidar = (
  //   event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  //   id: string
  // ) => {
  //   event.stopPropagation();
  //   router.push(`/dashboard/candidato/checklist/${id}`);
  // };

  useEffect(() => {
    //fetch
    const token = localStorage.getItem("token");
    if (user.id) {
      const getDadosUnidades = async () => {
        const response = await fetch(`${apiUrl}/v1/unidade?limit=200`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseJson = await response.json();
        setUnidades(responseJson.results);
      };
      getDadosUnidades();
    }
  }, [user.id]);

  const handleCreate = () => {
    console.log("criar unidade");
  };

  return (
    <Box margin="24px">
      <Container>
        <Typography variant="h3" marginBottom="12x" textAlign="center">
          Lista de Unidades
        </Typography>

        <Box
          gap="20px"
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Button
            variant="contained"
            onClick={handleCreate}
            startIcon={<AddIcon />}
          >
            Adicionar unidade
          </Button>
          <DataGrid
            sx={{ backgroundColor: "#fff", maxWidth: "650px" }}
            getRowId={(row) => row.id}
            rows={unidades}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
          />
        </Box>
      </Container>
    </Box>
  );
}
