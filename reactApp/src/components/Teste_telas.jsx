import React, { useState } from 'react';
import { TextField, Grid,Box } from '@mui/material';

const ProgramadoAtualFields = () => {
  // Estado dos valores
  const [values, setValues] = useState({
    kgPerHour: { programado: "080.00", atual: "080.71" },
    thickness: { programado: "008.00", atual: "008.07" },
    speed: { programado: "062.54", atual: "062.54" },
    grammage: { programado: "021.32", atual: "021.51" },
    width: { programado: "1400", atual: "" }
  });

  // Função para manipular mudanças nos campos
  const handleChange = (event, field, type) => {
    setValues({
      ...values,
      [field]: {
        ...values[field],
        [type]: event.target.value,
      },
    });
  };

  return (
    <Box p={3}>
      
      <Grid container spacing={2}>
        {[
          { label: 'Kg/h', field: 'kgPerHour' },
          { label: 'Espessura', field: 'thickness' },
          { label: 'm/min', field: 'speed' },
          { label: 'Gramatura', field: 'grammage' },
          { label: 'Largura', field: 'width' },
        ].map((item, index) => (
          <Grid container item xs={12} spacing={2} key={index}>
            <Grid item xs={6}>
              <TextField
                label={`${item.label} Programado`}
                value={values[item.field].programado}
                onChange={(e) => handleChange(e, item.field, 'programado')}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`${item.label} Atual`}
                value={values[item.field].atual}
                onChange={(e) => handleChange(e, item.field, 'atual')}
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProgramadoAtualFields;
