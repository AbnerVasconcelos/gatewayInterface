import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { socket } from "../socket";
import DialogWrapper from "./DialogWrapper";
import InfoIcon from '@mui/icons-material/Info';

const StatBox = ({
  title,
  socketVariavel,
  value,
  increase,
  icon,
  description,
  ligado,
  gridColumn,
  gridRow,
  dialogTitle,
  dialogContent,
  dialogActions
}) => {
  const theme = useTheme();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    // Adiciona o efeito visual de clique
    setIsClicked(true);
    // Remove o efeito após 500ms
    setTimeout(() => setIsClicked(false), 500);
    // Envia a mensagem com o estado invertido de 'ligado'
    const data = { [socketVariavel]: !ligado };
    socket.emit("mensagem", data);
    console.log("Mensagem enviada via socket.io:", data);
  };

  return (
    <Box
      gridColumn={gridColumn}
      gridRow={gridRow}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={
        isClicked
          ? theme.palette.success.light
          : ligado
          ? theme.palette.secondary[900]
          :  theme.palette.background.alt
      }
      borderRadius="0.55rem"
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        transform: isClicked ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Cabeçalho com título e ícone com função de diálogo */}
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>
        {/* Impede a propagação do clique para não disparar handleClick */}
        <Box onClick={(e) => e.stopPropagation()}>
          <DialogWrapper
            triggerComponent={icon || <InfoIcon fontSize="large" />}
            title={dialogTitle}
            content={dialogContent}
            actions={dialogActions}
          />
        </Box>
      </FlexBetween>

      {/* Valor principal */}
      <Typography
        variant="h4"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>

      {/* Linha de aumento e descrição */}
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          {increase}
        </Typography>
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
