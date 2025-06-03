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

const CardConfig = ({
  title,
  programmedValue,
  unit,
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
      // Modificação aqui - criar um objeto com a chave dinâmica
      const payload = { [title]: numericValue };
      console.log("Objeto enviado:", payload);
      // Aqui você pode enviar o payload via socket ou outra ação necessária
      closeModal();
    } else {
      setErrorMessage("Entrada Inválida");
    }
  };

  return (
    <>
      <Card
        sx={{
          minWidth: 150,
          minHeight: 20,
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
            padding: "0.1rem",
            "&:last-child": {
              paddingBottom: "0.1rem",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: "bold",
              mb: 1,
              color: theme.palette.text.primary,
              textAlign: "left",
            }}
          >
            {title}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" alignItems="baseline">
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: theme.palette.success.main,
                }}
              >
                {programmedValue || "N/A"}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: "normal",
                  color: theme.palette.text.secondary,
                  marginLeft: "1px",
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
              fontSize: "12px",
              textAlign: "center",
              padding: "5px",
              borderRadius: "5px",
              marginBottom: "5px",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {errorMessage || inputValue || title}
          </div>
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

export default CardConfig;