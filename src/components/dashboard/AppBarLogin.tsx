import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const appBarStyle = {
  backgroundColor: "#0f4c81",
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
};

const titleStyle = {
  flex: 1,
  marginRight: "85px",
};

const logoStyle = {
  marginLeft: "60px",
};

const headerContainerStyle = {
  marginBottom: "150px",
};

export default function AppBarLogin() {
  return (
    <div style={headerContainerStyle}>
      <AppBar position="absolute" sx={appBarStyle}>
        <Toolbar
          sx={{
            backgroundColor: "#0f4c81",
            pr: "24px",
          }}
        >
          <div style={containerStyle}>
            <Typography variant="h6" color="inherit" noWrap sx={titleStyle}>
              CLD 2024 - SEMED
            </Typography>
            <div style={logoStyle}>
              <Image
                width={300}
                height={60}
                src={
                  "https://portaleducacao.anapolis.go.gov.br/portal/wp-content/uploads/2021/04/LOGO-SECRETARIA-EDUCACAO-1.png"
                }
                alt="Logo"
              />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
