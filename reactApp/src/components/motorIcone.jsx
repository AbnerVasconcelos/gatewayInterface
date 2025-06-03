import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const MotorIcone = ({
  title = "Título",
  onOff = false,
  error = false,
  width = "100px",
  height = "100px",
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (error) return theme.palette.error.main;
    if (onOff)  return theme.palette.success.main;
    return "rgba(76, 175, 80, 0.1)";
  };

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width={width}
      height={height}
      sx={{
        backgroundColor: getBackgroundColor(),
        borderRadius: "0.55rem",
        transition: "background-color 0.3s ease",
        padding: "0.5rem",
        "&:hover": {
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {title && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            position: "absolute",
            top: 4,                    // ↓ deslocamento reduzido
            left: 4,
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {title}
        </Typography>
      )}

      {/* usando Box como <img> facilita o sx e a consistência */}
      <Box
        component="img"
        src="/motorElétrico.png"
        alt={title ? `Motor Elétrico – ${title}` : "Motor Elétrico"}
        sx={{
          width: "70%",
          height: "100%",
          objectFit: "contain",
          marginLeft: "auto"
        }}
      />
    </Box>
  );
};

export default MotorIcone;
