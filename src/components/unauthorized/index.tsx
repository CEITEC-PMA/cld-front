import {
  Box,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Unauthorized() {
  const theme = useTheme();
  const router = useRouter();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = 100 / ((5 * 1000) / 100);
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 500);

    return () => clearTimeout(timer);
  }, [progress, router]);

  return (
    <Box margin="0" padding="0" height={`calc(100vh - 66px)`} overflow="hidden">
      <Typography
        variant={smDown ? "h6" : mdDown ? "h5" : "h4"}
        textAlign="center"
        marginTop={2}
        color=" #0f4c81"
      >
        Credenciais não autorizadas
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        height="100%"
      >
        <Typography
          variant="h4"
          textAlign="center"
          marginTop={1.2}
          color=" #000"
        >
          Você não possui autorização para acessar essa página
        </Typography>
        {/* <Box width="100%" maxWidth="400px" alignSelf="center" marginTop="48px">
          <Typography align="center" marginBottom="6px">
            Você será redirecionado em 5 segundos
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="success"
            style={{ height: 10, width: "100%" }}
          />
        </Box> */}
      </Box>
    </Box>
  );
}
