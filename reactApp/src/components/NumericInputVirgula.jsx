import React, { useState, useEffect, useCallback } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { Dialog, DialogActions, DialogContent, Button, Grid, TextField, Box, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { socket } from "../socket";
import "./keyboardStyles.css";

const NumericInputVirgula = React.memo(({ tag = "velocidade", keyName, initialValue = "0,00", unit = "RPM" }) => {
  const theme = useTheme();
  const [socketValue, setSocketValue] = useState(initialValue); // Valor recebido via socket
  const [inputValue, setInputValue] = useState(initialValue); // Valor temporário digitado no teclado
  const [openKeyboard, setOpenKeyboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro

  const format = /^\d{1,3},\d{2}$/; // Formato padrão para "00,00"

  // Listener de socket configurado no mount
  useEffect(() => {
    const listener = (data) => {
      const parsedData = JSON.parse(data);
      if (keyName in parsedData) {
        setSocketValue(parsedData[keyName]); // Atualiza o valor com base na chave
      }
    };

    socket.on("read", listener); // Listener para o evento "read"
    return () => {
      socket.off("read", listener); // Remove o listener no unmount
    };
  }, [keyName]);

  // Atualiza o valor digitado em tempo real
  const handleChange = useCallback((input) => {
    setInputValue(input); // Permite atualização intermediária
    setErrorMessage(""); // Limpa mensagem de erro ao digitar
  }, []);

  // Abre o modal do teclado
  const openModal = useCallback(() => {
    setInputValue(socketValue); // Inicializa o teclado com o valor atual
    setErrorMessage(""); // Limpa mensagem de erro ao abrir
    setOpenKeyboard(true);
  }, [socketValue]);

  // Fecha o modal do teclado
  const closeModal = useCallback(() => {
    setOpenKeyboard(false);
    setErrorMessage(""); // Limpa mensagem de erro ao fechar
  }, []);

  // Envia o valor digitado via socket
  const sendData = useCallback(() => {
    if (format.test(inputValue)) {
      const parsedValue = parseFloat(inputValue.replace(",", "."));
      const data = { [tag]: parsedValue }; // Utiliza "tag" como chave e envia o valor numérico
      socket.emit("mensagem", data); // Envia os dados pelo socket
      console.log("Dado enviado:", data); // Log para depuração
      closeModal(); // Fecha o modal após envio
    } else {
      setErrorMessage("Entrada inválida! "); // Define mensagem de erro
    }
  }, [inputValue, tag, format, closeModal]);

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Campo de texto que exibe o valor recebido via socket */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={`Valor (${tag})`}
            value={socketValue} // Exibe o valor do socket
            onClick={openModal} // Abre o modal ao clicar
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: unit ? (
                <InputAdornment
                  position="end"
                  sx={{
                    borderRadius: "3px",
                    padding: "2px 5px",
                    margin: "0 5px",
                    fontSize: "14px",
                  }}
                >
                  {unit}
                </InputAdornment>
              ) : null,
              style: {
                textAlign: "center",
                fontSize: "16px",
                padding: "1px",
                borderRadius: "5px",
              },
            }}
            InputLabelProps={{
              style: {
                color: theme.palette.text.secondary,
              },
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>

      {/* Modal do teclado numérico */}
      <Dialog open={openKeyboard} onClose={closeModal}>
        <DialogContent>
          {/* Exibe o valor digitado no teclado ou a mensagem de erro */}
          <div
            className="react-simple-keyboard-input"
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
            {errorMessage || inputValue || "Digite aqui..."}
          </div>

          {/* Teclado numérico */}
          <Keyboard
            layout={{
              default: ["1 2 3", "4 5 6", "7 8 9", "0 , {bksp}"],
            }}
            display={{
              "{bksp}": "⌫",
            }}
            inputName="mainInput"
            onChange={handleChange} // Atualiza diretamente o estado
            initialValue={inputValue} // Define o valor inicial do teclado
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={sendData} color="primary">
            Enviar
          </Button>
          <Button onClick={closeModal} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default NumericInputVirgula;
