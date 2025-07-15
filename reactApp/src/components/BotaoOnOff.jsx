import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { socket } from "../socket";

const BotaoOnOff = ({
  on,
  onClick,
  socketVariavel,
  customIcon,
}) => {
  const theme = useTheme();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    // Efeito visual de clique
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);

    // Inverte o estado e monta a mensagem a ser enviada via socket.io,
    // usando a prop "socketVariavel" para definir dinamicamente a chave
    const newState = !on;
    const data = { [socketVariavel]: newState };
    socket.emit("mensagem", data);
    console.log("Mensagem enviada via socket.io:", data);

    // Callback opcional para propagar a mudança de estado
    if (onClick) onClick(newState);
  };

  return (
    <Box
     m="1rem 0.2rem 1.5rem 0.3rem"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: isClicked
          ? theme.palette.success.light
          : on
          ? theme.palette.secondary[900]
          : theme.palette.background.alt,
        borderRadius: "0rem",
        cursor: "pointer",
        transform: isClicked ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
        p: "0.5rem",
      }}
      onClick={handleClick}
    >
      {customIcon ? (
        customIcon
      ) : (
        <img
          src="/BotaoLigaDesligaSemfundo.png"
          alt="Logo Delfos"
          style={{
            width: "50px",
            height: "41px",
            objectFit: "contain",
            borderRadius: "0px",
          }}
        />
      )}
    </Box>
  );
};

export default BotaoOnOff;
