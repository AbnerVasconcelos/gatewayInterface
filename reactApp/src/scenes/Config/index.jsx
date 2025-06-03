import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery, Typography, Button } from "@mui/material";
import NumericInput from "components/NumericInput";
import NumericInputVirgula from "components/NumericInputVirgula";
import { socket } from "../../socket";
import CardConfig from "components/CardConfig";

const Config = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1000px)");
  const [messageReceived, setMessageReceived] = useState({});

  // Configuração do socket.io
  useEffect(() => {
    socket.on("read", (data) => {
      try {
        const parsedData = JSON.parse(data);
        setMessageReceived(parsedData);
        console.log("Dados recebidos e atualizados:", parsedData);
      } catch (error) {
        console.error("Erro ao processar dados do socket:", error);
      }
    });
    return () => {
      socket.off("read");
    };
  }, []);

  return (
    <Box m="0rem 0.5rem">
      {/* GRID PRINCIPAL */}
      <Box
      padding={"0.5rem"}
        mt="2px"
        display="grid"
        gridTemplateColumns="repeat(30, 1fr)"
        gridAutoRows="75px"
        gap="5px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 1" },
        }}
      >
        {/* Balança Inferior */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Balança Inferior
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(8)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Balança Superior */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Balança Superior
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(9)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>
<Box>
{/* Config Extrusora */}
      <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Extrusora
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(2)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
      </Box>
{/* Config Puxador */}
      <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Puxador
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(3)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
      </Box>
</Box>
<Box gap = "2rem">
        {/* Config Funil A */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Funil A
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(4)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>
        {/* Config Funil B */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Funil B
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(4)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>
   
  </Box>
  <Box gap = "2rem">
 
        {/* Config Funil C */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Funil C
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(4)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>
        {/* Config Funil D */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Funil D
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(4)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>
  </Box>
        {/* Config Receita */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
            backgroundColor={theme.palette.background.alt}
            borderBottom={`1px solid ${theme.palette.divider}`}
            mb="0.5rem"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Config Receita
            </Typography>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.28rem">
            {[...Array(10)].map((_, index) => (
              <CardConfig
                key={index}
                title={`Config ${index + 1}`}
                programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
                unit="kg/h"
                inputValidation={{
                  maxLength: 6,
                  pattern: /^\d{1,3},\d{2}$/,
                  errorMessage: "O formato deve ser 00,00!"
                }}
              />
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Config;
