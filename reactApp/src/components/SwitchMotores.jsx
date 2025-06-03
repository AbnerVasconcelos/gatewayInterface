import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 2000,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

export default function SwitchMotores() {
  // Estado do switch "Ligado/Desligado"
  const [checked, setChecked] = React.useState(true);
  // Estado do switch "Manual/Automático"
  const [automatic, setAutomatic] = React.useState(false);

  const handleMainChange = (event) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    // Se desabilitar o switch principal, forçamos o modo manual
    if (!newChecked) {
      setAutomatic(false);
    }
  };

  const handleModeChange = (event) => {
    setAutomatic(event.target.checked);
  };

  return (
    <FormGroup>
      <Stack direction="row" spacing={0} alignItems="center">
        <FormControlLabel
          control={
            <IOSSwitch
              sx={{ m: 0.6 }}
              checked={checked}
              onChange={handleMainChange}
            />
          }
          label={checked ? "Ligado" : "Desligado"}
        />
        <FormControlLabel
          control={
            <IOSSwitch
              sx={{ m: 0.6 }}
              checked={automatic}
              onChange={handleModeChange}
              disabled={!checked}
            />
          }
          label={automatic ? "Automático" : "Manual"}
        />
      </Stack>
    </FormGroup>
  );
}
