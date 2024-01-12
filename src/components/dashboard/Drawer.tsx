import { Divider, IconButton, List, Toolbar, styled } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ListItems from "./listItems";
import { useUserContext } from "@/userContext";
import { usePathname } from "next/navigation";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";

interface DrawerProps {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
}

export default function DrawerComponent({
  open,
  toggleDrawer,
  drawerWidth,
}: DrawerProps) {
  const { user } = useUserContext();
  const pathname = usePathname();
  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      <List component="nav">
        {/* {user.role?.includes("super-adm") ? (
          <ListItems
            label="Lista de turmas"
            icon={<AssessmentIcon />}
            to="/dashboard/gerenciamento"
            isActive={
              pathname === "/dashboard/gerenciamento" ||
              pathname.startsWith("/dashboard/gerenciamento")
            }
          />
        ) : (
          <ListItems
            label="Turmas da unidade"
            icon={<MapsHomeWorkIcon />}
            to="/dashboard/turmas"
            isActive={
              pathname === "/dashboard/turmas" ||
              pathname.startsWith("/dashboard/turmas")
            }
          />
        )} */}

        {user.role === "user" && (
          <ListItems
            label="Cadastrar unidade"
            icon={<AssessmentIcon />}
            to="/dashboard/registro"
            isActive={
              pathname === "/dashboard/registro" ||
              pathname.startsWith("/dashboard/registro")
            }
          />
        )}

        {user.role?.includes("super-adm") && (
          <ListItems
            label="Detalhar unidade"
            icon={<SearchIcon />}
            to="/dashboard/busca"
            isActive={
              pathname === "/dashboard/busca" ||
              pathname.startsWith("/dashboard/busca")
            }
          />
        )}

        {user.role?.includes("ceitec") && (
          <ListItems
            label="Redefinição de senha"
            icon={<RotateLeftIcon />}
            to="/dashboard/settings"
            isActive={pathname === "/dashboard/settings"}
          />
        )}
      </List>
    </Drawer>
  );
}
