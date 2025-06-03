import React from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const GaugeComponent = ({
  minValue,
  maxValue,
  gaugeValue,
  width,
  height,
  startAngle,
  endAngle,
  unit,
}) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 1, md: 3 }}
      alignItems="center"
    >
      <Gauge
        width={width || 200}
        height={height || 120}
        value={gaugeValue}
        startAngle={startAngle || -90}
        endAngle={endAngle || 90}
        valueMin={minValue}
        valueMax={maxValue}
        text={({ value }) => `${value} ${unit}`}
        cornerRadius="10%"
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 20,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: "#ffbb00",
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    </Stack>
  );
};

GaugeComponent.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  gaugeValue: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  unit: PropTypes.string,
};

export default GaugeComponent;
