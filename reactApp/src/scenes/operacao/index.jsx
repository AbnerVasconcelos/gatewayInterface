import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery, Typography, Button } from "@mui/material";
import Legend from "components/Legend";
import InfoCard from "components/Cards";
import StatBox from "components/StatBox";
import ModelViewerWrapper from "components/Modelo";
import { socket } from "../../socket";
import StatBoxMotores from "components/StatBoxMotores";
import InfoIcon from '@mui/icons-material/Info';
import RealTimeLineChart from "components/LineCharts";



const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1000px)");
  const [messageReceived, setMessageReceived] = useState({});



  // Function to normalize nivelA from 0-20000 to -1.5-2.9
  const normalizeNivelA = (value) => {
    if (value === undefined || value === null) return 100; // Default value if undefined
    const minOriginal = 0;
    const maxOriginal = 20000;
    const minTarget = -1.5;
    const maxTarget = 2.9;
    
    // Linear normalization formula
    return minTarget + ((value - minOriginal) / (maxOriginal - minOriginal)) * (maxTarget - minTarget);
  };

  // Function to normalize nivelB from 0-20000 to -1.6-2.6
  const normalizeNivelB = (value) => {
    if (value === undefined || value === null) return 100; // Default value if undefined
    const minOriginal = 0;
    const maxOriginal = 20000;
    const minTarget = -1.6;
    const maxTarget = 2.6;
    
    // Linear normalization formula
    return minTarget + ((value - minOriginal) / (maxOriginal - minOriginal)) * (maxTarget - minTarget);
  };

  // Function to normalize nivelC from 0-20000 to 1.9-6.2
  const normalizeNivelC = (value) => {
    if (value === undefined || value === null) return 100; // Default value if undefined
    const minOriginal = 0;
    const maxOriginal = 20000;
    const minTarget = 1.9;
    const maxTarget = 6.2;
    
    // Linear normalization formula
    return minTarget + ((value - minOriginal) / (maxOriginal - minOriginal)) * (maxTarget - minTarget);
  };

  // Function to normalize nivelD from 0-20000 to 0.7-5.0
  const normalizeNivelD = (value) => {
    if (value === undefined || value === null) return 100; // Default value if undefined
    const minOriginal = 0;
    const maxOriginal = 20000;
    const minTarget = 0.7;
    const maxTarget = 5.0;
    
    // Linear normalization formula
    return minTarget + ((value - minOriginal) / (maxOriginal - minOriginal)) * (maxTarget - minTarget);
  };

  // Function to normalize pesoBalanca from 0-20000 to -4.8 to -3.2
  const normalizePesoBalanca = (value) => {
    if (value === undefined || value === null) return 100; // Default value if undefined
    const minOriginal = 0;
    const maxOriginal = 20000;
    const minTarget = -4.8;
    const maxTarget = -3.2;
    
    // Linear normalization formula
    return minTarget + ((value - minOriginal) / (maxOriginal - minOriginal)) * (maxTarget - minTarget);
  };

  // Function to normalize pesoMixer from 0-20000 to -9.1 to -4.8
  const normalizePesoMixer = (value) => {
    if (value === undefined || value === null) return 100; // Default value if undefined
    const minOriginal = 0;
    const maxOriginal = 20000;
    const minTarget = -9.1;
    const maxTarget = -4.8;
    
    // Linear normalization formula
    return minTarget + ((value - minOriginal) / (maxOriginal - minOriginal)) * (maxTarget - minTarget);
  };

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
        gridTemplateColumns="repeat(26, 1fr)"
        gridAutoRows="30px"
        gap="10px"
        rowGap={"4px"}
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 1" },
        }}
      >
        {/* COLUNA 1 */}
        <Box
        mt="20px"
          gridColumn="span 7"
          gridRow="span 17"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
          gap= "2rem"
        >
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="1.6rem">
            <Legend />
            <InfoCard
              title="Produção"
              programmedValue={
                messageReceived?.registers?.producao?.kgHoraProgramado !== undefined &&
                messageReceived?.registers?.producao?.kgHoraProgramado !== null
                  ? messageReceived.registers.producao.kgHoraProgramado
                  : "N/A"
              }
              actualValue={
                messageReceived?.registers?.producao?.kgHoraAtual !== undefined &&
                messageReceived?.registers?.producao?.kgHoraAtual !== null
                  ? messageReceived.registers.producao.kgHoraAtual
                  : "N/A"
              }
              socketVariavel={"kgHoraProgramado"}
              unit="kg/h"
              inputValidation={{
                maxLength: 5,
                pattern: /^\d{1,3}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Espessura"
              programmedValue={
                messageReceived?.registers?.producao?.espessuraProgramado !== undefined &&
                messageReceived?.registers?.producao?.espessuraProgramado !== null
                  ? messageReceived.registers.producao.espessuraProgramado
                  : "N/A"
              }
              actualValue={
                messageReceived?.registers?.producao?.espessuraAtual !== undefined &&
                messageReceived?.registers?.producao?.espessuraAtual !== null
                  ? messageReceived.registers.producao.espessuraAtual
                  : "N/A"
              }
              socketVariavel={"espessuraProgramada"}
              unit="μm"
              inputValidation={{
                maxLength: 5,
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Grama/Metro"
              programmedValue={
                messageReceived?.registers?.producao?.gramaturaAtual !== undefined &&
                messageReceived?.registers?.producao?.gramaturaAtual !== null
                  ? messageReceived.registers.producao.gramaturaAtual
                  : "N/A"
              }
              actualValue={
                messageReceived?.registers?.producao?.gramaturaAtual !== undefined &&
                messageReceived?.registers?.producao?.gramaturaAtual !== null
                  ? messageReceived.registers.producao.gramaturaAtual
                  : "N/A"
              }
              /*socketVariavel={"gramaturaProgramada"}*/
              unit="g/m"
              inputValidation={{
                maxLength: 5,
                pattern: /^\d{1,2},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Vel. Puxador"
              programmedValue={
                messageReceived?.registers?.producao?.puxadorProgramado !== undefined &&
                messageReceived?.registers?.producao?.puxadorProgramado !== null
                  ? messageReceived.registers.producao.puxadorProgramado
                  : "N/A"
              }
              actualValue={
                messageReceived?.registers?.Puxador?.puxadorFeedBackSpeed !== undefined &&
                messageReceived?.registers?.Puxador?.puxadorFeedBackSpeed !== null
                  ? messageReceived.registers.Puxador.puxadorFeedBackSpeed
                  : "N/A"
              }
              /*socketVariavel={"puxadorProgramado"}*/
              unit="m/min"
              inputValidation={{
                maxLength: 5,
                pattern: /^\d{1,3},\d{2}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />
            <InfoCard
              title="Largura"
              programmedValue={
                messageReceived?.registers?.producao?.larguraProgramada !== undefined &&
                messageReceived?.registers?.producao?.larguraProgramada !== null
                  ? messageReceived.registers.producao.larguraProgramada
                  : "N/A"
              }
              actualValue={
                messageReceived?.registers?.producao?.larguraAtual !== undefined &&
                messageReceived?.registers?.producao?.larguraAtual !== null
                  ? messageReceived.registers.producao.larguraAtual
                  : "N/A"
              }
              socketVariavel={"larguraProgramada"}
              unit="mm"
              inputValidation={{
                maxLength: 5,
                pattern: /^\d{1,4},\d{0}$/,
                errorMessage: "O formato deve ser 00,00!"
              }}
            />


          </Box>
        </Box>

        {/* COLUNA 2 – Modelo 3D */}
        <Box
          gridColumn="span 13"
          gridRow="span 18"
          backgroundColor={theme.palette.primary[600]}
          p="1rem"
          borderRadius="0.55rem"
        >
          <ModelViewerWrapper 
            modelPath="modelo.glb"
            colorFunil="#00ff00"
            maxValueFunil={100}
            socketValueFunilA={normalizeNivelA(messageReceived?.registers?.threeJs?.nivelA)} // normalized from 0-20000 to -1.5-2.9
            socketValueFunilB={normalizeNivelB(messageReceived?.registers?.threeJs?.nivelB)} // normalized from 0-20000 to -1.6-2.6
            socketValueFunilC={normalizeNivelC(messageReceived?.registers?.threeJs?.nivelC)} // normalized from 0-20000 to 1.9-6.2
            socketValueFunilD={normalizeNivelD(messageReceived?.registers?.threeJs?.nivelD)} // normalized from 0-20000 to 0.7-5.0
            colorBatch="#00FF00"
            maxValueBalacaA={100}
            socketValueBalacaA={normalizePesoBalanca(messageReceived?.registers?.threeJs?.pesoBalanca)} // normalized from 0-20000 to -4.8 to -3.2
            colorMisturador="#00FF00"
            maxValueMisturador={100}       // max =100 
            socketValueMisturador={normalizePesoMixer(messageReceived?.registers?.threeJs?.pesoMixer)} // normalized from 0-20000 to -9.1 to -4.8
           
            socketFaltaMaterialA={messageReceived?.coils?.threeJs?.testeA || false}
            socketFaltaMaterialB={messageReceived?.coils?.threeJs?.testeB || false}
            socketFaltaMaterialC={messageReceived?.coils?.threeJs?.testeC || false}
            socketFaltaMaterialD={messageReceived?.coils?.threeJs?.testeD || false}
            socketReceitaA={messageReceived?.registers?.threeJs?.percentualA || "000" }
            socketReceitaB={messageReceived?.registers?.threeJs?.percentualB || "000"}
            socketReceitaC={messageReceived?.registers?.threeJs?.percentualC || "000"}
            socketReceitaD={messageReceived?.registers?.threeJs?.percentualD || "000"}
            socketTagA="PP"
            socketTagB="PE"
            socketTagC="Aditivo"
            socketTagD="Virgem"

            socketSensorA={messageReceived?.coils?.threeJs?.capacitivoA || false}
            socketSensorB={messageReceived?.coils?.threeJs?.capacitivoB || false}
            socketSensorC={messageReceived?.coils?.threeJs?.capacitivoC || false}
            socketSensorD={messageReceived?.coils?.threeJs?.capacitivoD || false}

            socketVacuoA={messageReceived?.coils?.threeJs?.alimentandoA || false}
            socketVacuoB={messageReceived?.coils?.threeJs?.alimentandoB || false}
            socketVacuoC={messageReceived?.coils?.threeJs?.alimentandoC || false}
            socketVacuoD={messageReceived?.coils?.threeJs?.alimentandoD || false}

            socketReceitaBalancaA = {(messageReceived?.registers?.threeJs?.pesoBalanca ?? 0) / 1000}
            socketTagBalanca="Balança"
            socketReceitaMisturador = {(messageReceived?.registers?.threeJs?.pesoMixer ?? 0) / 1000}
            socketTagMisturador="Misturador"
          />
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 8"
          backgroundColor={theme.palette.primary[600]}
          display="flex"
          flexDirection="column"
          gap="0.5rem"
          p="0.5rem"
          borderRadius="0.55rem"
        >
            {/* STAT BOXES */}
            <StatBoxMotores
              title="Extrusora"
              jsonOnOff={"extrusoraLigaDesligaBotao"}
              jsonAutMan={"extrusoraAutManBotao"}
              socketVariavel={"extrusoraRefVelocidade"}
              textTrueOnoff={"Ligado"}
              textFalseOnOff={"Desligado"}
              textTrueControl={"Controle de Produção"}
              textFalseControl={"Controle de Produção"}
              value={messageReceived?.registers?.Extrusora?.extrusoraFeedBackSpeed || "000"}
              minValue={0}
              maxValue={1745}
              unit="Rpm"
              icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
              ligado={messageReceived?.coils?.Extrusora?.extrusoraLigadoDesligado || false}
              onOff={messageReceived?.coils?.Extrusora?.extrusoraLigadoDesligado || false}
              autManual={messageReceived?.coils?.Extrusora?.extrusoraAutManEstado || false}
              dialogTitle="Detalhes da Extrusora"
              erro={messageReceived?.coils?.Extrusora?.extrusoraErro || false}
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
              jsonOnOff={"puxadorLigaDesliga"}
              jsonAutMan={"puxadorAutManBotao"}
              socketVariavel={"puxadorRefVelocidade"}
              textTrueOnoff={"Ligado"}
              textFalseOnOff={"Desligado"}
              textTrueControl={"Controle de Espessura"}
              textFalseControl={"Controle de Espessura"}
              value={messageReceived?.registers?.Puxador?.puxadorFeedBackSpeed || "000"}
              unit="m/min"  
              minValue={0}
              maxValue={120}
              ligado={messageReceived?.coils?.Puxador?.puxadorLigadoDesligado ?? false}
              onOff={messageReceived?.coils?.Puxador?.puxadorLigadoDesligado ?? false}
              autManual={messageReceived?.coils?.Puxador?.puxadorAutManEstado ?? false}
              erro={messageReceived?.coils?.Puxador?.puxadorErro ?? false}
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
        

        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 8"
          backgroundColor={theme.palette.primary[600]}
          display="flex"
          flexDirection="column"
          gap="0.5rem"
          p="0.5rem"
          borderRadius="0.55rem"
        >
        </Box>
       


     {/* <Box
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
                socketVariavel={"habilitaDosagem"}
                value={messageReceived?.coils?.dosador?.habilitaDosagem ? "Ligado" : "Desligado"}
                increase={messageReceived?.coils?.dosador?.habilitaDosagem ? "Ligado" : "Desligado"}
                ligado={messageReceived?.coils?.dosador?.habilitaDosagem ?? false}
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
                title=" "
                socketVariavel={"resetTotalizador"}
                value={"REINICIAR"}
                increase={"Totalizadores"}
                ligado={""}
                icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
                dialogTitle="Detalhes do Dosador"
                dialogContent={
                  <Box>
                    <img 
                      src="logo512.png"
                      alt="Imagem do Reset"
                      style={{ 
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        marginBottom: '1rem'
                      }}
                    />
                    <Typography gutterBottom>
                      Informações detalhadas sobre o Puxador para consulta e acompanhamento.
                    </Typography>
                  </Box>
                }
                dialogActions={
                  <Button onClick={() => console.log("Ação Dosador")}>
                    Ação Customizada
                  </Button>
                }
              />
              <StatBox
                title="Totalizador Kg"
                socketVariavel={"ligaDesligaTotalizadorPeso"}
                gridColumn='span 3'
                gridRow='span 1'
                value={messageReceived?.registers?.totalizadores?.totalizadorMetragem || "****"}
                increase={messageReceived?.coils?.totalizadores?.ligaDesligaTotalizador ? "Ligado" : "Desligado"}
                ligado={false}
                icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
                dialogTitle="Detalhes do Dosador"
                dialogContent={
                  <Box>
                    <img 
                      src="/path/to/your/image.jpg"
                      alt="Imagem do Dosador"
                      style={{ 
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        marginBottom: '1rem'
                      }}
                    />
                    <Typography gutterBottom>
                      Informações detalhadas sobre o Puxador para consulta e acompanhamento.
                    </Typography>
                  </Box>
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
                title="Totalizador Metros"
                socketVariavel={"ligaDesligaTotalizadorMetros"}
                value={messageReceived?.coils?.totalizadores?.ligaDesligaTotalizador || "****"}
                increase={messageReceived?.coils?.totalizadores?.ligaDesligaTotalizador ? "Ligado" : "Desligado"}
                
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
          </Box>
      </Box> */}
  
      </Box>
    </Box>
  );
};

export default Dashboard;
/* key	ObjecTag	Identifiers	Tipo	Delta Adress	Modbus	At	comentarios
Extrusora	extrusoraErro	ERRO	M	108	2156	%MB	
Extrusora	extrusoraAutManEstado	MAN_AUT	M	121	2169	%MB	Retorno para botões
Extrusora	extrusoraLigadoDesligado	LIGADO	M	123	2171	%MB	
Extrusora	extrusoraAutManBotao	BOT_MAN_AUT	M	124	2172	%MB	
Extrusora	extrusoraLigaDesligaBotao	BT_LIGA	M	125	2173	%MB	
Extrusora	extrusoraFeedBackSpeed	VLCD_REAL_EXTRUSORA	D	7042	39810	%MW	
Extrusora	extrusoraRefVelocidade	IHM_VEL_EXTR	D	7355	40123	%MW	
producao	larguraProgramada	LARGURA_DO_FILME_IHM	D	411	4507	%MW	
producao	espessuraProgramado	ESPESSURA_IHM	D	446	4542	%MW	
producao	larguraAtual	LARGURA_FILME	D	7004	39772	%MW	 Peso e nivel são as mesmas variáveis
producao	kgHoraAtual	KG_HORA	D	7058	39826	%MW	WORD
producao	puxadorAtual	METRO_POR_MINUTO_PUXADOR	D	7023	39791	%MW	
producao	kgHoraProgramado	KG_HORA_PROGRAMADO	D	7058	39826	%MW	TESTE
producao	gramaturaProgramada	GRAMATURA_PROGRAMADA	D	7044	39812	%MW	
producao	gramaturaAtual	GRAMATURA_ATUAL	D	7046	39814	%MW	
producao	espessuraAtual	ESPESSURA_ATUAL	D	7047	39815	%MW	
producao	puxadorProgramado	MPM	D	7302	40070	%MW	
Puxador	puxadorLigaDesliga	BT_LIGA	M	102	2150	%MB	
Puxador	puxadorLigadoDesligado	LIGADO	M	103	2151	%MB	
Puxador	puxadorAutManBotao	BOT_MAN_AUT	M	104	2152	%MB	
Puxador	puxadorAutManEstado	MAN_AUT	M	105	2153	%MB	
Puxador	puxadorAlarmErro	ERRO	M	109	2157	%MB	
Puxador	puxadorFeedBackSpeed	METRO_POR_MINUTO_PUXADOR	D	7023	39791	%MW	DWORD
Puxador	puxadorRefVelocidade	IHM_VEL_PUXADOR	D	7235	40003	%MW	DWORD
threeJs	capacitivoA	CAPACITIVO_A	M	3	2051	%MB	
threeJs	capacitivoB	CAPACITIVO_B	M	4	2052	%MB	
threeJs	capacitivoC	CAPACITIVO_C	M	5	2053	%MB	
threeJs	capacitivoD	CAPACITIVO_D	M	6	2054	%MB	
threeJs	alimentandoMixer	BALANCA	M	24	2072	%MB	
threeJs	vacuoA	VACUO1	M	48	2096	%MB	
threeJs	vacuoB	VACUO2	M	49	2097	%MB	
threeJs	vacuoC	VACUO3	M	54	2102	%MB	
threeJs	vacuoD	VACUO4	M	55	2103	%MB	
threeJs	dosandoBalanca	DOSANDO_NA_BALANCA	M	194	2242	%MB	
threeJs	faltaMaterialA	ALRM_A	M	338	2386	%MB	
threeJs	faltaMaterialB	ALRM_B	M	339	2387	%MB	
threeJs	faltaMaterialC	ALRM_C	M	340	2388	%MB	
threeJs	faltaMaterialD	ALRM_D	M	341	2389	%MB	
threeJs	alimentandoA	RECARGA_A	M	360	2408	%MB	
threeJs	alimentandoB	RECARGA_B	M	361	2409	%MB	
threeJs	alimentandoC	RECARGA_C	M	362	2410	%MB	
threeJs	alimentandoD	RECARGA_D	M	363	2411	%MB	
threeJs	percentualA	MATERIAL_A_IHM	D	449	4545	%MW	
threeJs	percentualB	MATERIAL_B_IHM	D	450	4546	%MW	
threeJs	percentualC	MATERIAL_C_IHM	D	451	4547	%MW	
threeJs	percentualD	MATERIAL_D_IHM	D	452	4548	%MW	
threeJs	pesoMixer	BALANÇA_INFERIOR	D	7006	39774	%MW	 Peso e nivel são as mesmas variáveis
threeJs	pesoBalanca	BALANÇA_SUPERIOR	D	7007	39775	%MW	
threeJs	nivelA	NIVEL_A	D	7605	40373	%MW	
threeJs	nivelB	NIVEL_B	D	7606	40374	%MW	
threeJs	nivelC	NIVEL_C	D	7607	40375	%MW	
threeJs	nivelD	NIVEL_D	D	7608	40376	%MW	
dosador	habilitaDosagem	HABILITA_DOSAGEM	M	58	2106	%MB	
totalizadores	totalizadorMetragem	ACUMULADOR_METROS	D	7160	39928	%MW	
totalizadores	totalizadorKiloGrama	TOTALIZADOR_KG	D	7024	39792	%MW	
	ligaDesligaTotalizador		M	34	2082	%MB	
	resetTotalizador		M	35	2083	%MB	*/