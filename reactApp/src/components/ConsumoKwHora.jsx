import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import { socket } from "../socket";

const ConsumoKwHora = ({ title, value, unit = "kW/h", socketVariavel }) => {
  const [consumo, setConsumo] = useState(value || "0.00");
  const [isUpdating, setIsUpdating] = useState(false);
 const theme = useTheme();

  useEffect(() => {
    // Update from props
    if (value !== undefined) {
      setConsumo(value);
    }

    // Listen for socket updates
    socket.on("read", (data) => {
      try {
        const parsedData = JSON.parse(data);
        if (socketVariavel && parsedData.registers && parsedData.registers[socketVariavel]) {
          setConsumo(parsedData.registers[socketVariavel]);
          setIsUpdating(true);
          setTimeout(() => setIsUpdating(false), 500);
        }
      } catch (error) {
        console.error("Erro ao processar dados do socket:", error);
      }
    });

    return () => {
      socket.off("read");
    };
  }, [value, socketVariavel]);

  return (
    <Paper
      elevation={3}
      sx={{
      
        p: 2,
        borderRadius: "0.55rem",
        transition: "background-color 0.3s ease",
        backgroundColor: isUpdating ? theme.palette.background.alt : "inherit",
      }}
    >
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="baseline">
          <Typography variant="h4" fontWeight="medium" color="white">
            {consumo}
          </Typography>
          <Typography variant="body1" ml={1} color="text.secondary">
            {unit}
          </Typography>
        </Box>
        
        <Typography variant="h3" fontWeight="bold" ml={2}>
          {title || "Consumo Energético"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ConsumoKwHora;
