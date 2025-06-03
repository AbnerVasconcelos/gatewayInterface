import React, { useState, useEffect, useCallback } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { Dialog, DialogActions, DialogContent, Button, TextField, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { socket } from "../socket";

const NumericInput = React.memo(({ tag = "Velocidade", format = /^\d{1,4}$/, initialValue = "0000", unit = "RPM" }) => {
  const theme = useTheme();
  const [socketValue, setSocketValue] = useState(initialValue); // Valor recebido via socket
  const [inputValue, setInputValue] = useState(initialValue); // Valor temporário digitado no teclado
  const [openKeyboard, setOpenKeyboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para gerenciar mensagens de erro

  // Listener de socket configurado no mount
  useEffect(() => {
    const listener = (data) => {
      if (data && data.value) {
        setSocketValue(data.value); // Atualiza valor recebido via socket
      }
    };

    socket.on(tag, listener); // Adiciona o listener para eventos da tag
    return () => {
      socket.off(tag, listener); // Remove o listener no unmount
    };
  }, [tag]);

  // Atualiza o valor digitado em tempo real
  const handleChange = useCallback((input) => {
    setInputValue(input); // Atualiza diretamente o valor no estado
    setErrorMessage(""); // Limpa mensagens de erro ao digitar
  }, []);

  // Abre o modal do teclado
  const openModal = useCallback(() => {
    setInputValue(socketValue); // Inicializa o teclado com o valor atual
    setErrorMessage(""); // Reseta a mensagem de erro ao abrir o teclado
    setOpenKeyboard(true);
  }, [socketValue]);

  // Fecha o modal do teclado
  const closeModal = useCallback(() => {
    setOpenKeyboard(false);
    setErrorMessage(""); // Limpa mensagens de erro ao fechar
  }, []);

  // Envia o valor digitado via socket
  const sendData = useCallback(() => {
    if (format.test(inputValue)) {
      const numericValue = parseInt(inputValue, 10); // Converte a string para número
      const data = { [tag]: numericValue }; // Objeto simplificado com o número
      socket.emit("mensagem", data); // Envia os dados pelo socket
      console.log("Dado enviado:", data); // Log para depuração
      closeModal(); // Fecha o modal após envio
    } else {
      setErrorMessage("Entrada Inválida"); // Define mensagem de erro
    }
  }, [inputValue, tag, format, closeModal]);

  return (
    <>
      <TextField
        label={` ${tag}`}
        value={socketValue} // Exibe o valor do socket
        onClick={openModal} // Abre o modal ao clicar
        variant="outlined"
        InputProps={{
          endAdornment: unit ? (
            <InputAdornment
              position="end"
              sx={{
                borderRadius: "3px",
                padding: "0 3px",
                fontSize: "18px", // Mantenha a fonte clara e visível
                fontWeight: "bold",
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
            fontSize: "20px", // Aumenta o tamanho da fonte do label
            fontWeight: "arial", // Torna o texto do label mais visível
            color: theme.palette.secondary[300], // Usa a cor do tema
          },
        }}
      />

      {/* Modal do teclado numérico */}
      <Dialog open={openKeyboard} onClose={closeModal}>
        <DialogContent>
          {/* Exibe o valor digitado no teclado ou a mensagem de erro */}
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
            {errorMessage || inputValue || "Digite aqui..."}
          </div>

          {/* Teclado numérico */}
          <Keyboard
            layout={{
              default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp}"],
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
    </>
  );
});

export default NumericInput;
