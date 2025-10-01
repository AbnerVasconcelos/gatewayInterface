import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, useTheme } from "@mui/material";
import Totalizador from "./totalizadores"; // Ajuste o caminho conforme sua estrutura de pastas
import ConsumoKwHora from "./ConsumoKwHora";
import MotorIcone from "./motorIcone";
import { socket } from "../socket";
import MultiInputDialog from "./Receitas";
const BottomBar = () => {
  const theme = useTheme();
  const [messageReceived, setMessageReceived] = useState({});

  useEffect(() => {
    socket.on("read", (data) => {
      try {
        const parsedData = JSON.parse(data);
        setMessageReceived(parsedData);
        console.log("Dados recebidos e atualizados:", parsedData);
      } catch (error) {
        console.error("Erro ao processar dados do socket:", error);
      }
    });

    return () => {
      socket.off("read");
    };
  }, []);

  return (
    <AppBar
      sx={{
        position: "static",
        background: theme.palette.primary[500],
        boxShadow: "none",
        height: "60px",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", position: "relative" }}>
        {/* Lado esquerdo - ConsumoKwHora */}
      {/*  <Box
          padding={"0.5rem"}
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          width="30%"
          height={"100%"}
        >
          <ConsumoKwHora
            title="⚡"
            socketVariavel="consumoEnergia"
            value={messageReceived?.registers?.producao?.consumoEnergia?.toString() || "0"}
          />
        </Box> */}
       
        {/* Ícones de Misturador e Vácuo */}
        <Box padding={"0.5rem"} display="flex" flexDirection="row">
          <MotorIcone
            title="Misturador"
            onOff={messageReceived?.coils?.saidasDigitais?.misturador || false}
            error={messageReceived?.coils?.saidasDigitais?.erroMisturador || false}
            width="165px"
            height="55px"
          />
        </Box>
        <Box>
          <MotorIcone
            title="Vácuo"
            onOff={messageReceived?.coils?.saidasDigitais?.compressorRadial || false}
            error={messageReceived?.coils?.saidasDigitais?.erroCompressor || false}
            width="165px"
            height="55px"
          />
        </Box>
        <Box Box padding={"0.5rem"} display="flex" flexDirection="row" 
         width="165px"
         height="60px"
         >
        <MultiInputDialog />
        </Box>

        

        {/* Lado direito - Totalizadores */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          gap="1rem"
          width="70%"
        >
          <Totalizador
            socketVariavel="totalizadoresProducao"
            value={messageReceived?.registers?.totalizadores?.totalProducao?.toString() || "0"}
            unit="KG"
            ligado={messageReceived?.coils?.totalizadores?.ligaDesligaTotalizadorPeso || false}
            label="Produção Acumulada"
            width={300}
          />
          <Totalizador
            socketVariavel="totalizadoresMetros"
            value={messageReceived?.registers?.totalizadores?.totalMetros?.toString() || "0"}
            unit="m"
            ligado={messageReceived?.coils?.totalizadores?.ligaDesligaTotalizadorMetros || false}
            label="Metragem Acumulada"
            width={300}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BottomBar;