"use client";
import AppBarLogin from "@/components/dashboard/AppBarLogin";
import { Box, CssBaseline, Toolbar } from "@mui/material";

export default function RegisterPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarLogin />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          // flexGrow: 1,
          height: "100vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
