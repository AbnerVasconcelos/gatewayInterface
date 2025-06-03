import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

const ComposedTextField = ({
  label = "Produção",
  valorProgramado = "1200", // Valor programado padrão
  valorReal = "1187", // Valor real padrão
  unit ="RPM", // Unidade opcional, exemplo: "RPM"
}) => {
  const theme = useTheme(); // Hook para acessar o tema

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel
        htmlFor={`outlined-${label}`}
        sx={{
          fontSize: "20px", // Aumenta a fonte do label
          fontWeight: "bold",
          color: theme.palette.secondary[300], // Cor do tema secundário
        }}
      >
        {label}
      </InputLabel>
      <OutlinedInput 
        id={`outlined-${label}`}
        value={valorProgramado}
        label={label}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // Espaço entre os itens do adornment
              fontSize: "14px",
              color: theme.palette.text.secondary, // Texto com tema secundário
            }}
          >
            {/* Unidade (opcional) */}
            {unit && (
              <span
                style={{
                  fontWeight: "bold",
                  marginRight: "8px",
                  color: theme.palette.text.primary, // Cor da unidade
                }}
              >
                {unit}
              </span>
            )}
            {/* Separador */}
            <span
              style={{
                height: "20px",
                width: "1px",
                backgroundColor: theme.palette.divider, // Cor do separador com tema
              }}
            ></span>
            {/* Valor Real */}
            <span
              style={{
                fontWeight: "bold",
                color: theme.palette.text.primary, // Cor principal do texto
              }}
            >
              Real: {valorReal}
            </span>
          </InputAdornment>
        }
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider, // Cor do contorno inicial
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.secondary, // Cor ao passar o mouse
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main, // Cor ao focar
          },
          textAlign: "center",
          fontSize: "16px", // Fonte do valor
        }}
      />
    </FormControl>
  );
};

export default ComposedTextField;
