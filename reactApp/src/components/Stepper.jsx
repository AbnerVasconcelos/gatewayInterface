import * as React from 'react';
import {
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useEffect, useState } from 'react';

const StepperMotores = ({ onOff = false, autManual = false, orientation = "horizontal", width = "100%" }) => {
  const [isOn, setIsOn] = useState(false);
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => setIsOn(onOff), [onOff]);
  useEffect(() => setIsAuto(autManual), [autManual]);

  const getActiveStep = () => {
    if (!isOn) return 0;
    if (isOn && !isAuto) return 1;
    if (isOn && isAuto) return 2;
    return 0;
  };

  const activeStep = getActiveStep();

  const steps = ["Off", "ON", "AUT."];

  return (
    <Stepper
      activeStep={activeStep}
      orientation={orientation}
      sx={{ 
        width,
        '& .MuiStepLabel-root': {
          padding: '0px'
        },
        '& .MuiStepLabel-labelContainer': {
          marginTop: '-8px'
        }
      }}
      alternativeLabel={orientation === "horizontal"}
    >
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperMotores;
