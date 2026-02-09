import React, { useEffect, useMemo, useState } from "react";
import { Box, useTheme, useMediaQuery, Typography, Button } from "@mui/material";
import Legend from "components/Legend";
import InfoCard from "components/Cards";
import ModelViewerWrapper from "components/Modelo";
import { socket } from "../../socket";
import StatBoxMotores from "components/StatBoxMotores";
import InfoIcon from "@mui/icons-material/Info";

/* ------------------------------------------------------------------ */
/* 1) Versões memoizadas dos componentes filhos                      */
/* ------------------------------------------------------------------ */
const MemoInfoCard = React.memo(InfoCard);
const MemoStatBoxMotores = React.memo(StatBoxMotores);
const MemoModelViewerWrapper = React.memo(ModelViewerWrapper);

/* ------------------------------------------------------------------ */
/* 2) Helpers de normalização                                         */
/* ------------------------------------------------------------------ */
const normalize = (v, [minO, maxO], [minT, maxT], fallback) => {
  if (v == null) return fallback;
  return minT + ((v - minO) / (maxO - minO)) * (maxT - minT);
};

const formatDecimal = (v) => {
  if (v == null || v === "N/A") return "N/A";
  const num = Number(v);
  if (isNaN(num)) return "N/A";
  return (num / 100).toFixed(2).replace(".", ",");
};

const normalizeNivelA = (v) => normalize(v, [0, 20000], [-1.5, 2.9], -1.5);
const normalizeNivelB = (v) => normalize(v, [0, 20000], [-1.6, 2.6], -1.6);
const normalizeNivelC = (v) => normalize(v, [0, 20000], [1.9, 6.2], 1.9);
const normalizeNivelD = (v) => normalize(v, [0, 20000], [0.7, 5.0], 0.7);
const normalizePesoBalanca = (v) => normalize(v, [0, 20000], [-4.8, -3.2], -4.8);
const normalizePesoMixer = (v) => normalize(v, [0, 20000], [-9.1, -3.5], -9.1);

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1000px)");
  const [messageReceived, setMessageReceived] = useState({});
  const [producaoData, setProducaoData] = useState({});

  /* ---------------------------------------------------------------- */
  /* 3) Objetos de validação MEMOIZADOS                               */
  /* ---------------------------------------------------------------- */
  const valKgHora = useMemo(() => ({
    maxLength: 5,
    pattern: /^\d{1,2},\d{2}$/,
    errorMessage: "O formato deve ser 00,00!",
  }), []);

  const valEspessura = useMemo(() => ({
    maxLength: 5,
    pattern: /^\d{1,2},\d{2}$/,
    errorMessage: "O formato deve ser 00,00!",
  }), []);

  const valGramaMetro = useMemo(() => ({
    maxLength: 5,
    pattern: /^\d{1,2},\d{2}$/,
    errorMessage: "O formato deve ser 00,00!",
  }), []);

  const valPuxador = useMemo(() => ({
    maxLength: 5,
    pattern: /^\d{1,3},\d{2}$/,
    errorMessage: "O formato deve ser 00,00!",
  }), []);

  const valLargura = useMemo(() => ({
    maxLength: 5,
    pattern: /^\d{1,4}$/,
    errorMessage: "O formato deve ser 00,00!",
  }), []);

  /* ---------------------------------------------------------------- */
  /* 4) Handler do socket                                             */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const onRead = (data) => {
      try {
        const parsed = JSON.parse(data);
        setMessageReceived(parsed);
        if (parsed?.timestamp); //console.log("read:", parsed.timestamp);
      } catch (e) {
        console.error("Erro ao processar dados do socket:", e);
      }
    };
    socket.on("read", onRead);
    return () => socket.off("read", onRead);
  }, []);

  useEffect(() => {
    const onProducao = (data) => {
      try {
        const parsed = JSON.parse(data);
        console.log("producao recebido:", parsed);
        setProducaoData(parsed);
      } catch (e) {
        console.error("Erro ao processar dados de producao:", e);
      }
    };
    socket.on("producao", onProducao);
    return () => socket.off("producao", onProducao);
  }, []);
  /* ---------------------------------------------------------------- */
  /* 5) Derivados MEMOIZADOS                                          */
  /* ---------------------------------------------------------------- */
  const three = messageReceived?.registers?.threeJs ?? {};
  const coilsThree = messageReceived?.coils?.threeJs ?? {};
  const prod = messageReceived?.registers?.producao ?? {};
  const pux = messageReceived?.registers?.Puxador ?? {};
  const extr = messageReceived?.registers?.Extrusora ?? {};
  const coilsExtr = messageReceived?.coils?.Extrusora ?? {};
  const coilsPux = messageReceived?.coils?.Puxador ?? {};

  const funilA = useMemo(() => normalizeNivelA(three?.nivelA), [three?.nivelA]);
  const funilB = useMemo(() => normalizeNivelB(three?.nivelB), [three?.nivelB]);
  const funilC = useMemo(() => normalizeNivelC(three?.nivelC), [three?.nivelC]);
  const funilD = useMemo(() => normalizeNivelD(three?.nivelD), [three?.nivelD]);

  const balancaA = useMemo(() => normalizePesoBalanca(three?.pesoBalanca), [three?.pesoBalanca]);
  const mixer = useMemo(() => normalizePesoMixer(three?.pesoMixer), [three?.pesoMixer]);

  const receitaBalancaA = useMemo(() => (three?.pesoBalanca ?? 0) / 1000, [three?.pesoBalanca]);
  const receitaMixer = useMemo(() => (three?.pesoMixer ?? 0) / 1000, [three?.pesoMixer]);

  /* ---------------------------------------------------------------- */
  /* 6) Render                                                        */
  /* ---------------------------------------------------------------- */
  return (
    <Box m="0rem 0.5rem">
      <Box
        mt="2px"
        display="grid"
        gridTemplateColumns="repeat(26, 1fr)"
        gridAutoRows="30px"
        gap="10px"
        rowGap={"4px"}
        sx={{ "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 1" } }}
      >
        {/* COLUNA 1 */}
        <Box
          mt="20px"
          gridColumn="span 7"
          gridRow="span 17"
          backgroundColor={theme.palette.background.alt}
          p="0.5rem"
          borderRadius="0.55rem"
          gap="2rem"
        >
          <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" rowGap="1.6rem">
            <Legend />

            <MemoInfoCard
              title="Produção"
              programmedValue={formatDecimal(prod?.kgHoraProgramado) ?? "N/A"}
              actualValue={producaoData?.kg_h ?? "N/A"}
              socketVariavel="kgHoraProgramado"
              unit="kg/h"
              inputValidation={valKgHora}
            />

            <MemoInfoCard
              title="Espessura"
              programmedValue={formatDecimal(prod?.espessuraProgramada) ?? "N/A"}
              actualValue={producaoData?.espessura_um ?? "N/A"}
              socketVariavel="espessuraProgramada"
              unit="μm"
              inputValidation={valEspessura}
            />

            <MemoInfoCard
              title="Grama/Metro"
              programmedValue={formatDecimal(prod?.gramaturaProgramada) ?? "N/A"}
              actualValue={producaoData?.gramatura_g_m2 ?? "N/A"}
              socketVariavel="gramaturaProgramada"
              unit="g/m"
              inputValidation={valGramaMetro}
            />

            <MemoInfoCard
              title="Vel. Puxador"
              programmedValue={formatDecimal(prod?.puxadorProgramado) ?? "N/A"}
              actualValue={pux?.puxadorFeedBackSpeed ?? "N/A"}
              socketVariavel="puxadorRefVelocidade"
              unit="m/min"
              inputValidation={valPuxador}
            />

            <MemoInfoCard
              title="Largura"
              programmedValue={prod?.larguraProgramada ?? "N/A"}
              actualValue={prod?.larguraAtual ?? "N/A"}
              socketVariavel="larguraProgramada"
              unit="mm"
              inputValidation={valLargura}
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
          <MemoModelViewerWrapper
            modelPath="modelo.glb"
            colorFunil="#be74be"
            maxValueFunil={100}
            socketValueFunilA={funilA}
            socketValueFunilB={funilB}
            socketValueFunilC={funilC}
            socketValueFunilD={funilD}
            colorBatch="#be74be"
            maxValueBalacaA={100}
            socketValueBalacaA={balancaA}
            colorMisturador="#be74be"
            maxValueMisturador={100}
            socketValueMisturador={mixer}
            socketFaltaMaterialA={coilsThree?.faltaMaterialA || false}
            socketFaltaMaterialB={coilsThree?.faltaMaterialB || false}
            socketFaltaMaterialC={coilsThree?.faltaMaterialC || false}
            socketFaltaMaterialD={coilsThree?.faltaMaterialD || false}
            socketReceitaA={three?.percentualA || "000"}
            socketReceitaB={three?.percentualB || "000"}
            socketReceitaC={three?.percentualC || "000"}
            socketReceitaD={three?.percentualD || "000"}
            socketTagA="Desligado"
            socketTagB="Virgem"
            socketTagC="Virgem"
            socketTagD="Chiclete"
            socketSensorA={coilsThree?.capacitivoA || false}
            socketSensorB={coilsThree?.capacitivoB || false}
            socketSensorC={coilsThree?.capacitivoC || false}
            socketSensorD={coilsThree?.capacitivoD || false}
            socketVacuoA={coilsThree?.alimentandoA || false}
            socketVacuoB={coilsThree?.alimentandoB || false}
            socketVacuoC={coilsThree?.alimentandoC || false}
            socketVacuoD={coilsThree?.alimentandoD || false}
            socketReceitaBalancaA={receitaBalancaA}
            socketTagBalanca="Balança"
            socketReceitaMisturador={receitaMixer}
            socketTagMisturador="Misturador"
          />
        </Box>

        {/* MOTORES */}
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
          <MemoStatBoxMotores
            title="Extrusora"
            jsonOnOff="extrusoraLigaDesligaBotao"
            jsonAutMan="extrusoraAutManBotao"
            socketVariavel="extrusoraRefVelocidade"
            textTrueOnoff="Ligado"
            textFalseOnOff="Desligado"
            textTrueControl="Controle de Produção"
            textFalseControl="Controle de Produção"
            value={extr?.extrusoraFeedBackSpeed ?? 0}
            minValue={0}
            maxValue={1745}
            unit="Rpm"
            icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
            ligado={coilsExtr?.extrusoraLigadoDesligado || false}
            onOff={coilsExtr?.extrusoraLigadoDesligado || false}
            autManual={coilsExtr?.extrusoraAutManEstado || false}
            dialogTitle="Detalhes da Extrusora"
            erro={coilsExtr?.extrusoraErro || false}
            dialogContent={<Typography gutterBottom>Detalhes específicos da Extrusora.</Typography>}
            dialogActions={<Button onClick={() => console.log("Ação Contatora")}>Ação Customizada</Button>}
          />

          <MemoStatBoxMotores
            title="Puxador"
            jsonOnOff="puxadorLigaDesliga"
            jsonAutMan="puxadorAutManBotao"
            socketVariavel="puxadorRefVelocidade"
            textTrueOnoff="Ligado"
            textFalseOnOff="Desligado"
            textTrueControl="Controle de Espessura"
            textFalseControl="Controle de Espessura"
            value={pux?.puxadorFeedBackSpeed ?? 0}
            unit="m/min"
            minValue={0}
            maxValue={80}
            ligado={coilsPux?.puxadorLigadoDesligado ?? false}
            onOff={coilsPux?.puxadorLigadoDesligado ?? false}
            autManual={coilsPux?.puxadorAutManEstado ?? false}
            erro={coilsPux?.puxadorErro ?? false}
            icon={<InfoIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
            dialogTitle="Detalhes do Puxador"
            dialogContent={<Typography gutterBottom>Informações detalhadas sobre o Puxador.</Typography>}
            dialogActions={<Button onClick={() => console.log("Ação Puxador")}>Ação Customizada</Button>}
            inputValidation={valPuxador}
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
        />
      </Box>
    </Box>
  );
};

export default React.memo(Dashboard);
