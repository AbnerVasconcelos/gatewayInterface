import React, { useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
//import { useGetSalesQuery } from "state/api";
import { teste } from '../../src/data/data.js'

const Pressao = () => {
  const { monthlyData } = teste; // Corrected: Destructure monthlyData directly from the teste object
  const theme = useTheme();
console.log(monthlyData)
  const formattedData = useMemo(() => {
    if (!monthlyData) return []; // Corrected: Check for monthlyData instead of data

    const pessureLine = {
      id: "pressure",
      color: theme.palette.secondary.main,
      data: [],
    };
    const currentLine = {
      id: "current",
      color: theme.palette.secondary[600],
      data: [],
    };

    monthlyData.forEach(({ timeStamp, pressure, current }) => { // Corrected: Use monthlyData directly
      pessureLine.data = [
        ...pessureLine.data,
        { x: timeStamp, y: pressure },
      ];
      currentLine.data = [
        ...currentLine.data,
        { x: timeStamp, y: current },
      ];
    });

    const formattedData = [pessureLine, currentLine];
    return formattedData;
  }, [monthlyData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (

       
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{
               type: "point",
                max: 100,
              }}
            yScale={{
              type: "linear",
              min: 0,
              max: 250,
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            // curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 20,
              tickRotation: 90,
              legend: "h",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 10,
              tickRotation: 0,
              legend: "Pressão em Bars",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={1}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 10,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
     
    
  );
};

export default Pressao;
