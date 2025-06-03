import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery, Typography, Button } from "@mui/material";
import { socket } from "../../socket";
import RealTimeLineChart from "components/LineCharts";

const Producao = () =>{
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1000px)");
    const [messageReceived, setMessageReceived] = useState({});
    return(
    <Box m="0rem 0.5rem">
      {/* GRID PRINCIPAL */}
      <Box
        mt="2px"
        display="grid"
        gridTemplateColumns="repeat(26, 1fr)"
        gridAutoRows="30px"
        gap="10px"
        rowGap={"4px"}
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 1" },
        }}
      >
        <Box
        mt="20px"
        gridColumn="span 26"
        gridRow="span 17"
        backgroundColor={theme.palette.background.alt}
        p="0.5rem"
        borderRadius="0.55rem"
        gap= "2rem"
        >
            <RealTimeLineChart height="100%" width="100%"/>
           </Box>
        </Box>
    </Box>
    )
}

export default Producao