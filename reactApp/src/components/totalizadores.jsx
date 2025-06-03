import React, { useState, useEffect } from 'react';
import { Paper, TextField, IconButton, useTheme, InputAdornment, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { socket } from '../socket';

const Totalizador = ({
  socketVariavel,
  value: initialValue,
  unit,
  ligado,
  label,
  width = 200
}) => {
  const theme = useTheme();
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleToggle = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);

    if (ligado) {
      // Se estiver ligado, abre o diálogo antes de desligar
      setOpenDialog(true);
    } else {
      // Se estiver desligado, apenas liga
      socket.emit('mensagem', { [socketVariavel]: true });
      console.log('Toggle enviado via socket.io:', { [socketVariavel]: true });
    }
  };

  const handleDialogClose = (shouldReset) => {
    setOpenDialog(false);
    
    if (shouldReset) {
      // Envia sinal de reset
      socket.emit('mensagem', { [`reset_${socketVariavel}`]: true });
      console.log('Reset enviado via socket.io:', { [`reset_${socketVariavel}`]: true });
    }
    
    // Envia sinal de desligamento
    socket.emit('mensagem', { [socketVariavel]: false });
    console.log('Toggle enviado via socket.io:', { [socketVariavel]: false });
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue);
      socket.emit('mensagem', { [socketVariavel]: newValue });
      console.log('Valor numérico enviado via socket.io:', { [socketVariavel]: newValue });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width:"200px",
          backgroundColor: isClicked
            ? theme.palette.success.light
            : ligado
            ? theme.palette.secondary[900]
            : theme.palette.background.alt,
          borderRadius: '0.55rem',
          transition: 'transform 0.2s ease, background-color 0.2s ease'
        }}
        elevation={3}
      >
        <TextField
          variant="outlined"
          size="small"
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          inputProps={{
            inputMode: 'decimal',
            style: { textAlign: 'right' }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {unit}
              </InputAdornment>
            )
          }}
          sx={{ ml: 1, flex: 1 }}
        />

        <IconButton onClick={handleToggle} sx={{ p: '10px' }} aria-label="toggle">
          <PowerSettingsNewIcon />
        </IconButton>
      </Paper>

      <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Deseja zerar o acumulador?</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Não</Button>
          <Button onClick={() => handleDialogClose(true)} autoFocus>Sim</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Totalizador;
