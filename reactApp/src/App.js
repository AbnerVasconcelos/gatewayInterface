import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Admin from "scenes/admin";
import Login from "pages/Login/Login";
import Register from "pages/Register/Register";
import Alarmes from "scenes/Alarmes";
import Calibragem from "scenes/Calibragem";
import Config from "scenes/Config";
import Producao from "scenes/Produção";
import Receitas from "scenes/Receitas";

import { AuthProvider } from './context/AuthContext';
import { onAuthStateChanged } from 'firebase/auth'; //mapeia se autenticação foi feita com sucesso
import { useAuthentication } from './hooks/useAuthentication'; //Fornece autenticação
import Socket from "scenes/socket";
import {socket} from "./socket.js"
import Operacao from "scenes/operacao";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

//###############################Autenticação##############################
const [user, setUSer] = useState(undefined) //logica para monitorar estado do usuário
const {auth} = useAuthentication();

const loadingUser = user === undefined;

useEffect(() =>{
  onAuthStateChanged(auth, (user) =>{setUSer(user)})},[auth])

//########################socket#############################################
const SocketProvider = ({ children }) => {
  const MAX_BUFFER_SIZE = 10; // Tamanho máximo do buffer de dados
  const [dataBuffer, setDataBuffer] = useState([]);

  useEffect(() => {
    if (user) {
      socket.connect();

      const handleConnect = () => {
        console.log("Conectado ao servidor Socket.io");
        socket.emit("user", { email: user.email });
      };

      const handleDataReceived = (data) => {
        // Adicionar novo dado ao buffer
        setDataBuffer((prevBuffer) => {
          const newBuffer = [...prevBuffer, data];

          // Limitar o tamanho do buffer para o valor máximo definido
          if (newBuffer.length > MAX_BUFFER_SIZE) {
            newBuffer.shift(); // Remover o dado mais antigo do buffer
          }

          return newBuffer;
        });
      };

      socket.on("connect", handleConnect);
      socket.on("data", handleDataReceived);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("data", handleDataReceived);
        socket.disconnect();
      };
    }
  }, [user]);

  return children;
};


//#############################################################################

if(loadingUser){
  return <p>Carregando...</p>;
}

  return (
    <div className="app">
      <AuthProvider value={{user}}>
      <SocketProvider>
        <HashRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              /*<Route element={!user? <Login/>:<Layout/>}>
                <Route path="/" element={<Navigate to="/operacao" replace />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/operacao" element={<Operacao />} />
                <Route path="/register" element={<Register />} />
                <Route path="/socket" element={<Socket />} />
                <Route path="/receitas" element={<Receitas />} />
                <Route path="/producao" element={<Producao />} />
                <Route path="/alarmes" element={<Alarmes />} />
                <Route path="/calibragem" element={<Calibragem />} />
                <Route path="/config" element={<Config />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </HashRouter>
        </SocketProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
