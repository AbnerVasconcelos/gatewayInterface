import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery, Typography, Button } from "@mui/material";
import Legend from "components/Legend";
import InfoCard from "components/Cards";
import StatBox from "components/StatBox";
import ModelViewerWrapper from "components/Modelo";
import { socket } from "../../socket";
import StatBoxMotores from "components/StatBoxMotores";
import InfoIcon from '@mui/icons-material/Info';

const Alarmes = () => {
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
        mt="2px"
        display="grid"
        gridTemplateColumns="repeat(13, 1fr)"
        gridAutoRows="121px"
        gap="5px"
        rowGap={"4px"}
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 1" },
        }}
      >
        {/* COLUNA 1 */}
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="0.9rem">
            <Legend />
            <InfoCard
              title="Produção"
              programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              actualValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              unit="kg/h"
              inputValidation={{
                maxLength: 5, // 2 dígitos + vírgula + 2 dígitos
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Espessura"
              programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              actualValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              unit="μm"
              inputValidation={{
                maxLength: 5, // 2 dígitos + vírgula + 2 dígitos
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Grama/Metro"
              programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              actualValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              unit="g/m"
              inputValidation={{
                maxLength: 5, // 2 dígitos + vírgula + 2 dígitos
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Vel. Puxador"
              programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              actualValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              unit="m/min"
              inputValidation={{
                maxLength: 5, // 2 dígitos + vírgula + 2 dígitos
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Largura"
              programmedValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              actualValue={messageReceived?.hz?.alimFreqIhm || "N/A"}
              unit="mm"
              inputValidation={{
                maxLength: 5, // 2 dígitos + vírgula + 2 dígitos
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
          </Box>
        </Box>

        {/* COLUNA 2 – Modelo 3D */}
        <Box
          gridColumn="span 6"
          gridRow="span 4"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <ModelViewerWrapper 
            modelPath="modelo.glb"
            colorFunil="#00FF00"
            maxValueFunil={100}
            socketValueFunilA={2.9} // minimo = -1.5 , máximo= 2.9
            socketValueFunilB={2.6}     // minimo = -1.6 , máximo= 2.6
            socketValueFunilC={6.2}     // minimo = 1.9 , máximo= 6.2
            socketValueFunilD={5}     // minimo = 0.7 , máximo= 5
            colorBatch="#00FF00"
            maxValueBalacaA={100}
            socketValueBalacaA={-3.2}     // minimo = -4.8 , máximo= -3.2
            colorMisturador="#00FF00"
            maxValueMisturador={100}       // max =100 
            socketValueMisturador={-5.2} // minimo = -9.1 , máximo= -4.8 
           
            socketFaltaMaterialA={false}
            socketFaltaMaterialB={false}
            socketFaltaMaterialC={false}
            socketFaltaMaterialD={false}
            socketReceitaA={1}
            socketReceitaB={2}
            socketReceitaC={3}
            socketReceitaD={4}
            socketTagA="PP"
            socketTagB="PE"
            socketTagC="Aditivo"
            socketTagD="Virgem"

            socketSensorA={false}
            socketSensorB={false}
            socketSensorC={false}
            socketSensorD={false}

            socketVacuoA={false}
            socketVacuoB={false}
            socketVacuoC={false}
            socketVacuoD={false}

            socketReceitaBalancaA={5}
            socketTagBalanca="Balança"
            socketReceitaMisturador={6}
            socketTagMisturador="Misturador"
          />
        </Box>

        {/* STAT BOXES */}
        <StatBoxMotores
          title="Extrusora"
          value={messageReceived?.potencia?.Contatora || 750}
          minValue={0}
          maxValue={1745}
          unit="Rpm"
          icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
          ligado={messageReceived?.potencia?.Contatora ?? false}
          dialogTitle="Detalhes da Extrusora"
          dialogContent={
            <Typography gutterBottom>
              Aqui estão os detalhes específicos da Extrusora, com informações adicionais conforme necessário.
            </Typography>
          }
          dialogActions={
            <Button onClick={() => console.log("Ação Contatora")}>
              Ação Customizada
            </Button>
          }
        />
        <StatBoxMotores
          title="Puxador"
          value={messageReceived?.hz?.alimFreqIhm || 500}
          unit="m/min"
          minValue={0}
          maxValue={1000}
          ligado={messageReceived?.comandFeeder?.automaticoAlimentadorOne ?? false}
          icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
          dialogTitle="Detalhes do Puxador"
          dialogContent={
            <Typography gutterBottom>
              Informações detalhadas sobre o Puxador para consulta e acompanhamento.
            </Typography>
          }
          dialogActions={
            <Button onClick={() => console.log("Ação Puxador")}>
              Ação Customizada
            </Button>
          }
          inputValidation={{
            maxLength: 5, // 2 dígitos + vírgula + 2 dígitos
            pattern: /^\d{1,2},\d{2}$/,
            errorMessage: "O formato deve ser 00,00!"
          }}
        />


      <Box
          gridColumn="span 13"
          gridRow="span 1"
         
          p="0.5rem"
          borderRadius="0.55rem"
      >
          <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              columnGap="0.5rem"
              rowGap="0rem"
              justifyContent="center" // Centraliza os itens no grid
              
            >
              <StatBox
                gridColumn='span 3'
                gridRow='span 1'
                title="Dosador"
                value={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                increase={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                
                ligado={messageReceived?.comandFeeder?.automaticoAlimentadorOne ?? false}
                icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
                dialogTitle="Detalhes do Dosador"
                dialogContent={
                  <Typography gutterBottom>
                    Informações detalhadas sobre o Puxador para consulta e acompanhamento.
                  </Typography>
                }
                dialogActions={
                  <Button onClick={() => console.log("Ação Dosador")}>
                    Ação Customizada
                  </Button>
                }
              />

              <StatBox
                gridColumn='span 3'
                gridRow='span 1'
                title="Dosador"
                value={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                increase={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                
                ligado={messageReceived?.comandFeeder?.automaticoAlimentadorOne ?? false}
                icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
                dialogTitle="Detalhes do Dosador"
                dialogContent={
                  <Typography gutterBottom>
                    Informações detalhadas sobre o Puxador para consulta e acompanhamento.
                  </Typography>
                }
                dialogActions={
                  <Button onClick={() => console.log("Ação Dosador")}>
                    Ação Customizada
                  </Button>
                }
              />

              <StatBox
                gridColumn='span 3'
                gridRow='span 1'
                title="Dosador"
                value={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                increase={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                
                ligado={messageReceived?.comandFeeder?.automaticoAlimentadorOne ?? false}
                icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
                dialogTitle="Detalhes do Dosador"
                dialogContent={
                  <Typography gutterBottom>
                    Informações detalhadas sobre o Puxador para consulta e acompanhamento.
                  </Typography>
                }
                dialogActions={
                  <Button onClick={() => console.log("Ação Dosador")}>
                    Ação Customizada
                  </Button>
                }
              />
              <StatBox
                gridColumn='span 3'
                gridRow='span 1'
                title="Dosador"
                value={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                increase={messageReceived?.comandFeeder?.automaticoAlimentadorOne ? "Ligado" : "Desligado"}
                
                ligado={messageReceived?.comandFeeder?.automaticoAlimentadorOne ?? true}
                icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
                dialogTitle="Detalhes do Dosador"
                dialogContent={
                  <Typography gutterBottom>
                    Informações detalhadas sobre o Puxador para consulta e acompanhamento.
                  </Typography>
                }
                dialogActions={
                  <Button onClick={() => console.log("Ação Dosador")}>
                    Ação Customizada
                  </Button>
                }
              />
            </Box>
      </Box>
  
      </Box>
    </Box>
  );
};

export default Alarmes;
