import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Legend = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="transparent"
      padding="0.1rem"
    >
      {/* Legenda para "Programado" */}
      <Box display="flex" alignItems="center" gap="0.3rem">
        <Box
          sx={{
            width: '12px',
            height: '12px',
            backgroundColor: 'green', // Cor verde para Programado
            borderRadius: '50%',
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 16  }}>
          Programado
        </Typography>
      </Box>

      {/* Legenda para "Atual" */}
      <Box display="flex" alignItems="center" gap="0.3rem">
        <Box
          sx={{
            width: '12px',
            height: '12px',
            backgroundColor: '#00ffff', // Cor vermelha para Atual
            borderRadius: '50%',
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.primary',fontSize: 16 }}>
          Atual
        </Typography>
      </Box>
    </Box>
  );
};

export default Legend;
