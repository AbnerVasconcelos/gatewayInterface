import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useTheme } from "@mui/material/styles";
import { socket } from "../socket";

const InfoCard = ({
  title,
  programmedValue,
  actualValue,
  unit,
  socketVariavel,
  inputValidation = {
    maxLength: 4,
    pattern: /^\d{1,4}$/,
    errorMessage: "O valor deve ter no máximo 4 dígitos!"
  }
}) => {
  const theme = useTheme();

  const [openKeyboard, setOpenKeyboard] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const keyboardRef = useRef(null);

  // Abre o modal do teclado
  const openModal = () => {
    setInputValue("");
    setErrorMessage("");
    setOpenKeyboard(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setOpenKeyboard(false);
    setErrorMessage("");
  };

  // Atualiza o valor digitado removendo espaços
  const handleChange = (input) => {
    const normalizedInput = input.replace(/\s/g, '');
    if (normalizedInput.length > inputValidation.maxLength) {
      setErrorMessage(inputValidation.errorMessage);
      setInputValue("");
      if (keyboardRef.current) {
        keyboardRef.current.setInput("");
      }
    } else {
      setInputValue(normalizedInput);
      setErrorMessage("");
    }
  };

  const sendData = () => {
    // Remove todas as vírgulas do valor digitado
    const normalizedValue = inputValue.replace(/,/g, '');
    if (inputValidation.pattern.test(inputValue)) {
      const numericValue = parseInt(normalizedValue, 10);
      // Modificação aqui - envio via socket.io igual ao BotaoOnOff
      const data = { [socketVariavel]: numericValue };
      socket.emit("mensagem", data);
      console.log("Mensagem enviada via socket.io:", data);
      closeModal();
    } else {
      setErrorMessage("Entrada Inválida");
    }
  };

  // Função auxiliar para formatar valores
  const formatValue = (value) => {
    return value !== undefined && value !== null ? value : "N/A";
  };

  return (
    <>
      <Card
        sx={{
          minWidth: 250,
          borderRadius: "5px",
          boxShadow: 1,
          margin: 0,
          padding: 0,
          backgroundColor: theme.palette.primary[900],
          cursor: "pointer",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:active": {
            transform: "scale(1.1)",
            boxShadow: `0 0 30px ${theme.palette.primary.light}`,
          },
        }}
        onClick={openModal}
      >
        <CardContent
          sx={{
            padding: "0.4rem",
            "&:last-child": {
              paddingBottom: "0.4rem",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              mb: 1,
              color: theme.palette.text.primary,
              textAlign: "left",
            }}
          >
            {title}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="baseline" sx={{ marginLeft: "4.5rem" }}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: theme.palette.success.main,
                }}
              >
                {formatValue(programmedValue)}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: "normal",
                  color: theme.palette.text.secondary,
                  marginLeft: "4px",
                }}
              >
                {unit}
              </Typography>
            </Box>
            <Box display="flex" alignItems="baseline">
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: '#00ffff',
                }}
              >
                {formatValue(actualValue)}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: "normal",
                  color: theme.palette.text.secondary,
                  marginLeft: "4px",
                }}
              >
                {unit}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openKeyboard} onClose={closeModal}>
        <DialogContent>
          <div
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              fontSize: "22px",
              textAlign: "center",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {errorMessage || inputValue || title}
          </div>
          
          {/* Estilos inline para o teclado */}
          <Box sx={{ mt: 2 }}>
            <style>
              {`
                .hg-theme-default {
                  background-color: #f5f5f5 !important;
                  border-radius: 4px !important;
                  padding: 8px !important;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                }
                .hg-button {
                  background-color: #ffffff !important;
                  border: 1px solid #ccc !important;
                  border-radius: 4px !important;
                  color: #333 !important;
                  cursor: pointer !important;
                  display: inline-block !important;
                  font-size: 16px !important;
                  font-weight: 500 !important;
                  height: 50px !important;
                  line-height: 50px !important;
                  margin: 4px !important;
                  min-width: 50px !important;
                  padding: 0 !important;
                  text-align: center !important;
                  user-select: none !important;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                  transition: all 0.2s ease !important;
                }
                .hg-button:hover {
                  background-color: #e0e0e0 !important;
                  transform: translateY(-1px) !important;
                }
                .hg-button:active {
                  background-color: #d0d0d0 !important;
                  transform: scale(0.98) !important;
                }
                .hg-row {
                  display: flex !important;
                  justify-content: center !important;
                  margin-bottom: 4px !important;
                }
              `}
            </style>
            <Keyboard
              keyboardRef={(r) => (keyboardRef.current = r)}
              layout={{
                default: ["1 2 3", "4 5 6", "7 8 9", "0 , {bksp}"],
              }}
              display={{
                "{bksp}": "⌫",
              }}
              inputName="mainInput"
              onChange={handleChange}
              initialValue={inputValue}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={sendData} color="success">
            Enviar
          </Button>
          <Button onClick={closeModal} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoCard;