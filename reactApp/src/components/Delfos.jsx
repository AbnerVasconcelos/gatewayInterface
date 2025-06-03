import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from "@mui/material";

import FlexBetween from './FlexBetween';




const Delfos = () => {

const theme = useTheme();
  return (
<Box
  m="1rem 0.2rem 1.5rem 0.3rem"
  sx={{
    backgroundColor: theme.palette.primary[700],
    padding: '0.5rem 0.2rem',
    borderRadius: '2px',
  }}
>
  <FlexBetween alignItems="center">
    <Box display="flex" alignItems="center" gap="0.2rem">
      <img
        src="/logo192.png"
        alt="Logo Delfos"
        style={{
          width: '40px',
          height: '40px', 
          objectFit: 'contain',
          borderRadius: '1px',
        }}
      />
      <Box display="flex" flexDirection="column" lineHeight={1}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: 'white' }}
        >
          Delfos
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontSize: '0.6rem',
            letterSpacing: '1px',
            fontWeight: 300,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          BLOW FILM CONTROL
        </Typography>
      </Box>
    </Box>
  </FlexBetween>
</Box>

  );
};

export default Delfos;
