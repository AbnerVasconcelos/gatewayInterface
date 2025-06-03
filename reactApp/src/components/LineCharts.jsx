import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';

const RealTimeLineChart = ({ 
  width = "100%", 
  height = 100, 
  escala = false, 
  legenda = false, 
  cor = '#ffbb00',
  transparencia = 0.1 // Transparência padrão de 50%
}) => {
  const [data, setData] = useState([]);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const MAX_DATA_POINTS = 120;
  const [fullDataArray, setFullDataArray] = useState(Array(MAX_DATA_POINTS).fill(null));

  useEffect(() => {
    const interval = setInterval(() => {
      const mockValue = 100 + Math.floor(Math.random() * 50);
      setData(prev => [...prev, mockValue].slice(-MAX_DATA_POINTS));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newFullArray = Array(MAX_DATA_POINTS).fill(null);
    data.forEach((value, index) => newFullArray[index] = value);
    setFullDataArray(newFullArray);
  }, [data]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const xLabels = Array.from({ length: MAX_DATA_POINTS }, (_, i) => `#${i + 1}`);

  const hexToRGBA = (hex, alpha) => {
    let r = 255, g = 215, b = 0;
    if(hex.startsWith('#') && (hex.length === 7 || hex.length === 4)) {
      if (hex.length === 7) {
        r = parseInt(hex.slice(1,3),16);
        g = parseInt(hex.slice(3,5),16);
        b = parseInt(hex.slice(5,7),16);
      } else if (hex.length === 4) {
        r = parseInt(hex[1]+hex[1],16);
        g = parseInt(hex[2]+hex[2],16);
        b = parseInt(hex[3]+hex[3],16);
      }
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const colorWithTransparency = hexToRGBA(cor, transparencia);

  return (
    <Box ref={containerRef} sx={{ width, height, position: 'relative' }}>
      {containerSize.width > 0 && (
        <LineChart
          height={containerSize.height || height}
          width={containerSize.width || 400}
          series={[{ 
            data: fullDataArray, 
            area: true,
            showMark: false,
            connectNulls: false,
            color: cor,
            areaStyle: { fill: colorWithTransparency },
          }]}
          xAxis={[{ 
            scaleType: 'point', 
            data: xLabels,
            display: escala,
            tickLabelStyle: { display: escala ? 'block' : 'none' },
            axisLine: { display: escala },
            tickSize: escala ? undefined : 0,
          }]}
          yAxis={[{
            display: escala,
            tickLabelStyle: { display: escala ? 'block' : 'none' },
            axisLine: { display: escala },
            tickSize: escala ? undefined : 0,
          }]}
          legend={{ hidden: !legenda }}
          sx={{
            [`& .${lineElementClasses.root}`]: { display: 'none' },
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          }}
          margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
          disableAxisListener={!escala}
        />
      )}
    </Box>
  );
};

export default RealTimeLineChart;
