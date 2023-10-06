import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiUrl } from "@/utils/api";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface AppBarComponentProps {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
}

export default function AppBarComponent({
  open,
  toggleDrawer,
  drawerWidth,
}: AppBarComponentProps) {
  const [usuario, setUsuario] = useState({ nome: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      //fetch
      const getDadosUser = async () => {
        const response = await fetch(`${apiUrl}/api/v1/usuarios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resJson = await response.json();
        console.log(resJson);
        setUsuario(resJson.usuario);
        return response;
      };
      getDadosUser().catch(() => {
        alert("erro de conecção");
        router.push("/login");
      });
    }
  }, [router]);

  const handleOnClick = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  console.log(usuario);

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          backgroundColor: "#0f4c81",
          pr: "24px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Sistema de Eleição de Diretores
        </Typography>
        <div>
          <Image
            width={320}
            height={55}
            src={
              "https://portaleducacao.anapolis.go.gov.br/portal/wp-content/uploads/2021/04/LOGO-SECRETARIA-EDUCACAO-1.png"
            }
            alt="Logo"
          />
        </div>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, textAlign: "right" }}
        >
          {usuario?.nome}
        </Typography>
        <IconButton
          onClick={() => handleOnClick()}
          color="inherit"
          sx={{ marginLeft: "10px" }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
