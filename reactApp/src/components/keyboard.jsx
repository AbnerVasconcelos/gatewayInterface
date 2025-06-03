import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useTheme } from "@mui/material/styles";

/**
 * Componente KeyboardWrapper - Envolve qualquer componente e adiciona um teclado popup
 * 
 * @param {Object} props - Propriedades do componente
 * @param {ReactNode} props.children - Componente filho que disparará o teclado ao ser clicado
 * @param {string} props.title - Título exibido no teclado e usado como chave no objeto de envio
 * @param {Object} props.validation - Validação para o input
 * @param {number} props.validation.maxLength - Tamanho máximo permitido
 * @param {RegExp} props.validation.pattern - Padrão regex para validação
 * @param {string} props.validation.errorMessage - Mensagem de erro personalizada
 * @param {Function} props.onSubmit - Função chamada ao enviar o valor (opcional)
 * @param {Object} props.keyboardLayout - Layout personalizado do teclado
 * @param {Object} props.keyboardDisplay - Display personalizado das teclas
 * @param {string} props.format - Formato de saída ('number', 'string', etc)
 * @param {string} props.initialValue - Valor inicial do input
 * @param {Object} props.socket - Instância do socket.io já configurada (opcional)
 * @param {string} props.socketEvent - Nome do evento para enviar os dados (opcional)
 * @returns {JSX.Element}
 */
const KeyboardWrapper = ({
  children,
  title,
  validation = {
    maxLength: 4,
    pattern: /^\d{1,4}$/,
    errorMessage: "O valor deve ter no máximo 4 dígitos!"
  },
  onSubmit,
  keyboardLayout = {
    default: ["1 2 3", "4 5 6", "7 8 9", "0 , {bksp}"]
  },
  keyboardDisplay = {
    "{bksp}": "⌫"
  },
  format = "number", // 'number', 'string', etc.
  initialValue = "",
  socket = null,
  socketEvent = "update_parameter"
}) => {
  const theme = useTheme();
  const [openKeyboard, setOpenKeyboard] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const keyboardRef = useRef(null);

  // Abre o modal do teclado
  const openModal = () => {
    setInputValue(initialValue);
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
    
    if (normalizedInput.length > validation.maxLength) {
      setErrorMessage(validation.errorMessage);
      setInputValue("");
      if (keyboardRef.current) {
        keyboardRef.current.setInput("");
      }
    } else {
      setInputValue(normalizedInput);
      setErrorMessage("");
    }
  };

  // Formata o valor conforme o tipo especificado
  const formatValue = (value) => {
    const cleanValue = value.replace(/,/g, '.');
    
    switch (format) {
      case 'number':
        return parseFloat(cleanValue) || 0;
      case 'integer':
        return parseInt(cleanValue, 10) || 0;
      case 'string':
      default:
        return cleanValue;
    }
  };

  // Valida a entrada e envia o objeto simplificado
  const sendData = () => {
    if (validation.pattern.test(inputValue)) {
      const formattedValue = formatValue(inputValue);
      
      // Cria objeto no formato simplificado { "Título": valor }
      const payload = { [title]: formattedValue };
      
      // Envia via Socket.IO se disponível
      if (socket && socketEvent) {
        socket.emit(socketEvent, payload);
        console.log(`Enviado via Socket.IO (${socketEvent}):`, payload);
      }
      
      // Callback para manipulação adicional se fornecida
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(payload);
      }
      
      closeModal();
    } else {
      setErrorMessage("Entrada Inválida");
    }
  };

  return (
    <>
      <div 
        onClick={openModal}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
        {children}
      </div>

      <Dialog 
        open={openKeyboard} 
        onClose={closeModal}
        fullWidth
        maxWidth="xs"
      >
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
              fontWeight: errorMessage ? "normal" : "bold",
              color: errorMessage ? theme.palette.error.main : theme.palette.text.primary
            }}
          >
            {errorMessage || inputValue || title}
          </div>
          
          <SimpleKeyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layout={keyboardLayout}
            display={keyboardDisplay}
            onChange={handleChange}
            inputName="keyboardInput"
            theme={`hg-theme-default hg-layout-numeric ${theme.palette.mode === 'dark' ? 'hg-theme-dark' : ''}`}
            buttonTheme={[
              {
                class: "hg-red",
                buttons: "{bksp}"
              }
            ]}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={sendData} color="success" variant="contained">
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

export default KeyboardWrapper;