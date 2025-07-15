import React, { useState, useEffect } from "react";
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
import Flag from 'react-world-flags';
import BotaoOnOff from "./BotaoOnOff";
import { socket } from "../socket";


const initialAlarms = [
  { id: 1, message: "Queda de comunicação com o PLC !", active: true },
  { id: 2, message: "Falta de material no Funil A !", active: true },
  { id: 3, message: "Falta de material no Funil B !", active: true },
  { id: 4, message: "Falta de material no Funil C !", active: true },
  { id: 5, message: "Falta de material no Funil D !", active: true },
  { id: 6, message: "Célula da balança desconectada!", active: true },
  { id: 7, message: "Sem Material no Bag, Funis não conseguem se abastecer!", active: true },
  { id: 8, message: "Falha no motor do puxador", active: true },
  { id: 9, message: "Falha no motor da extrusora", active: true },
  { id: 10, message: "Falha na leitura do encoder", active: true },
];

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [alarms, setAlarms] = useState(initialAlarms);// Estado dos alarmes (mock data)
  const [messageReceived, setMessageReceived] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());// Atualiza a data e hora a cada segundo


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // (Opcional) Simula atualização dos alarmes a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) => ({
          ...alarm,
          active: Math.random() < 0.3, // 30% de chance de estar ativo
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      sx={{
        position: "static",
        background: theme.palette.primary[700],
        boxShadow: "none",
        height:"57px"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", position: "relative"  }}>
        {/* LEFT SIDE */}
        <FlexBetween sx={{ maxHeight: "64px", overflow: "hidden" }}>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <Box display="flex" flexDirection="row" alignItems="center" gap="0.5rem" height="100%">
          <Delfos />
          <BotaoOnOff on={messageReceived?.coils?.dosador?.habilitaDosagem } onClick={() => {}} socketVariavel="habilitaDosagem" />
          </Box>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="0.5rem">

        <div style={{ display: 'flex', gap: '1rem' }}>
      <Flag code="BR" style={{ width: 48, height: 32 }} />
      <Flag code="ES" style={{ width: 48, height: 32 }} />
      <Flag code="US" style={{ width: 48, height: 32 }} />
    </div>
          <IconButton onClick={() => dispatch(setMode())}>
            <LightModeOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          
           {/* CENTER: Data e Hora */}
           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          {currentTime.toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          {currentTime.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
        </Typography>
      </Box>
        </FlexBetween>

        {/* Container de alertas – comentado para este exemplo */}
        
        {/* <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: isSidebarOpen ? "100px" : "50%",
            transform: isSidebarOpen ? "none" : "translateX(-50%)",
            width: isSidebarOpen ? "calc(100% - 200px)" : "100%",
            maxWidth: "700px",
            zIndex: 1300,
          }}
        >
          {alarms
            .filter((alarm) => alarm.active)
            .map((alarm, index) => (
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
                          onClick={() =>
                            setAlarms((prev) =>
                              prev.map((a) =>
                                a.id === alarm.id ? { ...a, active: false } : a
                              )
                            )
                          }
                        >
                          Undo
                        </Button>
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() =>
                            setAlarms((prev) =>
                              prev.map((a) =>
                                a.id === alarm.id ? { ...a, active: false } : a
                              )
                            )
                          }
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
        </Box> */}
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
