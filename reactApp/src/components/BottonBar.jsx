import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, useTheme } from "@mui/material";
import Totalizador from "./totalizadores"; // Ajuste o caminho conforme sua estrutura de pastas
import ConsumoKwHora from "./ConsumoKwHora";
import MotorIcone from "./motorIcone";


const BottomBar = () => {
  const theme = useTheme();

  // Estados simulados para demonstrar o funcionamento do Totalizador
  const [metros, setMetros] = useState("0");
  const [ligado, setLigado] = useState(false);

  // useEffect para simulação de atualizações via socket.io.
  // Em uma implementação real, os listeners do socket.io atualizariam os estados.
  useEffect(() => {
    // Exemplo:
    // socket.on("atualizaMetros", (data) => setMetros(data.total));
    // socket.on("estadoMetros", (data) => setLigado(data.ligado));
    // return () => {
    //   socket.off("atualizaMetros");
    //   socket.off("estadoMetros");
    // };
  }, []);

  return (
    <AppBar
      sx={{
        position: "static",              // Mesma propriedade estática do Navbar
        background: theme.palette.primary[500], // Cor de fundo do Navbar (pode ser ajustada se necessário)
        boxShadow: "none",               // Sem sombra, conforme o Navbar
        height: "60px",                  // Altura do Navbar
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", position: "relative" }}>
        {/* Lado esquerdo - ConsumoKwHora */}
        <Box
          padding={"0.5rem"}
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"  // Alinha os itens à esquerda
          alignItems="center"          // Centraliza verticalmente
          width="30%"                  // Ocupa 30% da largura disponível
          height={"100%"}
        >
          <ConsumoKwHora 
            title="⚡"
            socketVariavel="consumoEnergia"
          />
        </Box>
        <Box padding={"0.5rem"} display="flex" flexDirection="row" >
          <MotorIcone title="Misturador" onOff = {false} error = {false} width = "165px" height = "60px"/>
        </Box>
        <Box>
          <MotorIcone title="Vácuo" onOff = {false} error = {false} width = "165px" height = "60px"/>
        </Box>
        
        {/* Lado direito - Totalizadores */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"    // Alinha os itens à direita
          alignItems="center"          // Centraliza verticalmente
          gap="1rem"
          width="70%"                  // Ocupa 70% da largura disponível
        >
          <Totalizador 
            socketVariavel="totalizadoresMetros"   // Identificador para as mensagens via socket.io
            value={metros}                         // Valor atual (ex.: total de metros)
            unit="KG"                              // Unidade de medida exibida
            ligado={true}                         // Estado que indica se a funcionalidade está habilitada
            label="Produção Acumulada"              // Texto exibido na borda do TextField
            width={300}                            // Largura do componente
          />
          <Totalizador 
            socketVariavel="totalizadoresMetros"   // Identificador para as mensagens via socket.io
            value={metros}                         // Valor atual (ex.: total de metros)
            unit="m"                               // Unidade de medida exibida
            ligado={ligado}                         // Estado que indica se a funcionalidade está habilitada
            label="Metragem Acumulada"              // Texto exibido na borda do TextField
            width={300}                            // Largura do componente
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BottomBar;
