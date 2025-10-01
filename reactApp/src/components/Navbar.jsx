// Navbar.memoized.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LightModeOutlined,
  Menu as MenuIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Collapse,
  Alert,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import Delfos from "./Delfos";
import Flag from "react-world-flags";
import BotaoOnOff from "./BotaoOnOff";
import { socket } from "../socket";

/* ------------------------------------------------------------------ */
/* 1) Versões memoizadas dos componentes filhos                      */
/* ------------------------------------------------------------------ */
const MemoDelfos = React.memo(Delfos);
const MemoBotaoOnOff = React.memo(BotaoOnOff);
const MemoFlag = React.memo(Flag);

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  /* ---------------------------------------------------------------- */
  /* 2) Estados locais                                                */
  /* ---------------------------------------------------------------- */
  const [alarms, setAlarms] = useState([]);
  const [messageReceived, setMessageReceived] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastCommunication, setLastCommunication] = useState(Date.now()); // timestamp última msg

  /* ---------------------------------------------------------------- */
  /* 3) Derivados MEMOIZADOS                                          */
  /* ---------------------------------------------------------------- */
  const dosadorOn = useMemo(
    () => !!(messageReceived?.coils?.dosador?.habilitaDosagem),
    [messageReceived]
  );

  const alimentadorOn = useMemo(
    () => !!(messageReceived?.coils?.alimentador?.habilitaAlimentador),
    [messageReceived]
  );

  const activeAlarms = useMemo(() => alarms.filter((a) => a.active), [alarms]);

  /* ---------------------------------------------------------------- */
  /* 4) Atualiza hora                                                 */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------------------------------------------------------- */
  /* 5) Handler do socket                                             */
  /* ---------------------------------------------------------------- */
  const handleSocketRead = useCallback((data) => {
    try {
      const parsedData = JSON.parse(data);
      setMessageReceived(parsedData);
      setLastCommunication(Date.now()); // atualiza hora da última comunicação

      const emergenciaAtiva = parsedData?.coils?.alarmes?.emergencia === true;
      const materialNaBalanca = parsedData?.coils?.alarmes?.materialNaBalanca === true;
      const erroNaDosagem = parsedData?.coils?.dosador?.erroNaDosagem === true;

      setAlarms((prevAlarms) => {
        let updatedAlarms = [...prevAlarms];

        // Emergência
        const emergenciaIndex = updatedAlarms.findIndex(
          (a) => a.id === "emergencia"
        );
        if (emergenciaAtiva) {
          if (emergenciaIndex === -1) {
            updatedAlarms.push({
              id: "emergencia",
              message: "Emergência Ativa! Após Desativar, pressione os RESET",
              active: true,
            });
          } else {
            updatedAlarms[emergenciaIndex].active = true;
          }
        } else if (emergenciaIndex !== -1) {
          updatedAlarms.splice(emergenciaIndex, 1);
        }

        // Material na Balança
        const materialIndex = updatedAlarms.findIndex(
          (a) => a.id === "materialNaBalanca"
        );
        if (materialNaBalanca) {
          if (materialIndex === -1) {
            updatedAlarms.push({
              id: "materialNaBalanca",
              message: "Material na Balança! Pressione a válvula de descarga",
              active: true,
            });
          } else {
            updatedAlarms[materialIndex].active = true;
          }
        } else if (materialIndex !== -1) {
          updatedAlarms.splice(materialIndex, 1);
        }

        // Erro na Dosagem
        const erroDosagemIndex = updatedAlarms.findIndex(
          (a) => a.id === "erroNaDosagem"
        );
        if (erroNaDosagem) {
          if (erroDosagemIndex === -1) {
            updatedAlarms.push({
              id: "erroNaDosagem",
              message: "Erro na Dosagem! Verifique o sistema de dosagem.",
              active: true,
            });
          } else {
            updatedAlarms[erroDosagemIndex].active = true;
          }
        } else if (erroDosagemIndex !== -1) {
          updatedAlarms.splice(erroDosagemIndex, 1);
        }

        return updatedAlarms;
      });
    } catch (error) {
      console.error("Erro ao processar dados do socket:", error);
    }
  }, []);

  useEffect(() => {
    socket.on("read", handleSocketRead);
    return () => socket.off("read", handleSocketRead);
  }, [handleSocketRead]);

  /* ---------------------------------------------------------------- */
  /* 5.1) Monitor de comunicação                                      */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const agora = Date.now();
      const tempoSemComunicacao = agora - lastCommunication;

      setAlarms((prevAlarms) => {
        let updatedAlarms = [...prevAlarms];
        const index = updatedAlarms.findIndex(
          (a) => a.id === "falhaComunicacao"
        );

        if (tempoSemComunicacao > 5000) {
          // sem comunicação há mais de 5s
          if (index === -1) {
            updatedAlarms.push({
              id: "falhaComunicacao",
              message:
                "Falha na Comunicação! Verifique a conexão do sistema.",
              active: true,
            });
          } else {
            updatedAlarms[index].active = true;
          }
        } else if (index !== -1) {
          // comunicação voltou → remove alarme
          updatedAlarms.splice(index, 1);
        }

        return updatedAlarms;
      });
    }, 2000); // checa a cada 2s

    return () => clearInterval(interval);
  }, [lastCommunication]);

  /* ---------------------------------------------------------------- */
  /* 6) Callbacks auxiliares                                          */
  /* ---------------------------------------------------------------- */
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((v) => !v),
    [setIsSidebarOpen]
  );

  const dismissAlarm = useCallback((alarmId) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, active: false } : a))
    );
  }, []);

  /* ---------------------------------------------------------------- */
  /* 7) Render                                                        */
  /* ---------------------------------------------------------------- */
  return (
    <AppBar
      sx={{
        position: "static",
        background: theme.palette.primary[700],
        boxShadow: "none",
        height: "57px",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", position: "relative" }}>
        {/* LEFT SIDE */}
        <FlexBetween sx={{ maxHeight: "64px", overflow: "hidden" }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="0.5rem"
            height="100%"
          >
            <MemoDelfos />
            <MemoBotaoOnOff
              on={dosadorOn}
              onClick={() => {}}
              socketVariavel="habilitaDosagem"
            />
            <Typography
              variant="body2"
              sx={{ color: "text.primary", fontSize: 14 }}
            >
              Dosagem
            </Typography>
            <MemoBotaoOnOff
              on={alimentadorOn}
              onClick={() => {}}
              socketVariavel="habilitaAlimentador"
            />
            <Typography
              variant="body2"
              sx={{ color: "text.primary", fontSize: 14 }}
            >
              Alimentador
            </Typography>
          </Box>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="0.5rem">
          <div style={{ display: "flex", gap: "1rem" }}>
            <MemoFlag code="BR" style={{ width: 48, height: 32 }} />
            <MemoFlag code="ES" style={{ width: 48, height: 32 }} />
            <MemoFlag code="US" style={{ width: 48, height: 32 }} />
          </div>
          <IconButton onClick={() => dispatch(setMode())}>
            <LightModeOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          {/* Data e Hora */}
          <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              {currentTime.toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              {currentTime.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </FlexBetween>

        {/* ALERTAS */}
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: isSidebarOpen ? "50px" : "58%",
            transform: isSidebarOpen ? "none" : "translateX(-50%)",
            width: isSidebarOpen ? "calc(100% - 200px)" : "100%",
            maxWidth: "600px",
            zIndex: 1300,
          }}
        >
          {activeAlarms.map((alarm, index) => (
            <Box
              key={alarm.id}
              sx={{
                position: "absolute",
                top: `${index * 10}px`,
                left: 0,
                right: 0,
                zIndex: 1000 + index,
              }}
            >
              <Collapse in={alarm.active}>
                <Alert
                  severity="error"
                  variant="outlined"
                  icon={<WarningIcon />}
                  action={
                    <>
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => dismissAlarm(alarm.id)}
                      >
                        OK
                      </Button>
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => dismissAlarm(alarm.id)}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  }
                  sx={{
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    "& .MuiAlert-icon": { color: "#fff" },
                  }}
                >
                  {alarm.message}
                </Alert>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
