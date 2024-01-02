import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthButton from "../auth/AuthButton";
import { Grid } from "@mui/material";

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
  const router = useRouter();

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

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          backgroundColor: "#0f4c81",
          pr: "24px",
        }}
      >
        <Grid container>
          <Grid
            alignSelf={"center"}
            item
            container
            xs={4}
            alignContent={"center"}
          >
            <Grid item height={"100%"}>
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
            </Grid>
            <Grid item alignSelf="center">
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                CLD 2024 - SEMED
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} textAlign={"center"}>
            <Image
              width={320}
              height={55}
              src={
                "https://portaleducacao.anapolis.go.gov.br/portal/wp-content/uploads/2021/04/LOGO-SECRETARIA-EDUCACAO-1.png"
              }
              alt="Logo"
            />
          </Grid>
          <Grid item xs={4}>
            <AuthButton />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
