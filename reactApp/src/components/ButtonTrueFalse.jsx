import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { socket } from "../socket";

const ButtonTrueFalse = ({ 
  tag, 
  value, 
  onChange, 
  textTrue, 
  textFalse,
  disabled = false,
  style // Adicionando prop style para receber estilos personalizados
}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  const handleClick = () => {
    if (disabled) return;
    
    setClicked(true);
    const newValue = !value;
    
    // Notify parent about change - parent decides what to do
    if (onChange) {
      onChange(newValue);
    }
    
    // If we still need to send socket message directly
    const data = { [tag]: newValue };
    socket.emit("mensagem", data);
    console.log("Estado enviado:", data);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: "100%" }}>
      <Button
        onClick={handleClick}
        variant="contained"
        disabled={disabled}
        sx={{
          width: "100%", // Alterado para ocupar 100% da largura
          height: "45px",
          fontSize: "14px",
          fontWeight: "arial",
          padding: "1px",
          backgroundColor: value ? "#4caf50" : "#9e9e9e",
          color: "#fff",
          "&:hover": {
            backgroundColor: value ? "#388e3c" : "#616161",
          },
          transform: clicked ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s ease-in-out',
          '&.Mui-disabled': {
            backgroundColor: value ? 'rgba(76, 175, 80, 0.7)' : 'rgba(158, 158, 158, 0.7)',
            color: 'rgba(255, 255, 255, 0.7)'
          },
          ...style // Aplicando estilos personalizados passados via prop
        }}
      >
        {value ? textTrue : textFalse}
      </Button>
    </Box>
  );
};

ButtonTrueFalse.defaultProps = {
  textTrue: "Automático",
  textFalse: "Manual",
};

export default React.memo(ButtonTrueFalse);