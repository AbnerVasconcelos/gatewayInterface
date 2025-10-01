import React, { useState, useRef } from "react";
import { Box, Button, Dialog, DialogContent, DialogActions, TextField, Typography, useTheme } from "@mui/material";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { socket } from "../socket";

const MultiInputDialog = ({
  socketVariaveis = ["materialA", "materialB", "materialC", "materialD"],
  inputValidation = {
    maxLength: 3,
    pattern: /^\d{1,3}$/,
    errorMessage: "Digite apenas números inteiros (máx. 3 dígitos)!"
  }
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({ A: "", B: "", C: "", D: "" });
  const [errors, setErrors] = useState({ A: "", B: "", C: "", D: "" });
  const [currentField, setCurrentField] = useState(null);
  const keyboardRef = useRef(null);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setInputs({ A: "", B: "", C: "", D: "" });
    setErrors({ A: "", B: "", C: "", D: "" });
    setCurrentField(null);
  };

  const handleFocus = (field) => {
    setCurrentField(field);
    keyboardRef.current?.setInput(inputs[field] || "");
  };

  const handleChange = (input) => {
    if (input.length > inputValidation.maxLength) {
      setErrors((prev) => ({ ...prev, [currentField]: inputValidation.errorMessage }));
      setInputs((prev) => ({ ...prev, [currentField]: "" }));
      keyboardRef.current.setInput("");
    } else {
      setInputs((prev) => ({ ...prev, [currentField]: input }));
      if (!inputValidation.pattern.test(input) && input !== "") {
        setErrors((prev) => ({ ...prev, [currentField]: inputValidation.errorMessage }));
      } else {
        setErrors((prev) => ({ ...prev, [currentField]: "" }));
      }
    }
  };

  const allValid = Object.values(inputs).every((val) => inputValidation.pattern.test(val));
  const sum = Object.values(inputs).reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0);
  const isReady = allValid && sum === 100;

  const sendData = async () => {
    for (let i = 0; i < socketVariaveis.length; i++) {
      const fieldKey = Object.keys(inputs)[i];
      const value = parseInt(inputs[fieldKey], 10);
      const data = { [socketVariaveis[i]]: value };
      socket.emit("mensagem", data);
      console.log("Enviado:", data);
      await new Promise((res) => setTimeout(res, 300));
    }
    closeModal();
  };

  // Estilos customizados para o teclado
  const keyboardTheme = {
    "hg-theme-default": {
      fontFamily: theme.typography.fontFamily,
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
      padding: "8px",
      boxShadow: theme.shadows[2]
    },
    "hg-button": {
      backgroundColor: "#ffffff",
      border: "1px solid #ccc",
      borderRadius: "4px",
      color: "#333",
      cursor: "pointer",
      display: "inline-block",
      fontSize: "16px",
      fontWeight: "500",
      height: "50px",
      lineHeight: "50px",
      margin: "4px",
      minWidth: "50px",
      padding: "0",
      textAlign: "center",
      userSelect: "none",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    "hg-button:hover": {
      backgroundColor: "#e0e0e0"
    },
    "hg-button:active": {
      backgroundColor: "#d0d0d0",
      transform: "scale(0.98)"
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        onClick={openModal}
        sx={{ 
          width: "100px", 
          height: "40px", 
          backgroundColor: theme.palette.primary[900] 
        }}
      >
        Receita
      </Button>

      <Dialog
        open={open}
        onClose={closeModal}
        PaperProps={{
          sx: {
            width: "350px",
            height: "700px",
            maxWidth: "90vw",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Preencha todos os campos
          </Typography>

          {["A", "B", "C", "D"].map((field) => (
            <Box key={field} mb={2}>
              <TextField
                label={`Funil ${field}`}
                fullWidth
                value={inputs[field]}
                error={!!errors[field]}
                helperText={errors[field]}
                onFocus={() => handleFocus(field)}
                InputProps={{ readOnly: true }}
              />
            </Box>
          ))}

          <Typography
            variant="body1"
            sx={{ mt: 2, color: sum === 100 ? "green" : "red", fontWeight: "bold" }}
          >
            Soma atual: {sum} {sum === 100 ? "(OK)" : "(deve ser 100)"}
          </Typography>

          {currentField && (
            <Box sx={{ mt: 2 }}>
              <style>
                {`
                  .hg-theme-default {
                    background-color: #f5f5f5;
                    border-radius: 4px;
                    padding: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
                  }
                  .hg-button:hover {
                    background-color: #e0e0e0 !important;
                  }
                  .hg-button:active {
                    background-color: #d0d0d0 !important;
                    transform: scale(0.98) !important;
                  }
                `}
              </style>
              <Keyboard
                keyboardRef={(r) => (keyboardRef.current = r)}
                layout={{
                  default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp}"],
                }}
                display={{
                  "{bksp}": "⌫",
                }}
                inputName="mainInput"
                onChange={handleChange}
                initialValue={inputs[currentField]}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={sendData} sx={{ color: "green" }} disabled={!isReady}>
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

export default MultiInputDialog;