import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState, useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";

import { AuthProvider } from "./context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthentication } from "./hooks/useAuthentication";
import { socket } from "./socket.js";

// ✅ Lazy load das rotas pesadas
const Layout = lazy(() => import("scenes/layout"));
const Admin = lazy(() => import("scenes/admin"));
const Login = lazy(() => import("pages/Login/Login"));
const Register = lazy(() => import("pages/Register/Register"));
const Alarmes = lazy(() => import("scenes/Alarmes"));
const Calibragem = lazy(() => import("scenes/Calibragem"));
const Config = lazy(() => import("scenes/Config"));
const Producao = lazy(() => import("scenes/Produção"));
const Receitas = lazy(() => import("scenes/Receitas"));
const SocketPage = lazy(() => import("scenes/socket"));
const Operacao = lazy(() => import("scenes/operacao"));

// ✅ Splash Screen leve
const SplashScreen = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <p>Carregando aplicação...</p>
  </div>
);

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  //############################### Autenticação ##############################
  const [user, setUser] = useState(undefined); // undefined = ainda carregando
  const { auth } = useAuthentication();
  const loadingUser = user === undefined;

  useEffect(() => {
    // Mantemos a assinatura do Firebase: quando o estado do auth mudar, atualizamos user (null = não logado)
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsubscribe();
  }, [auth]);

  //######################## socket #############################################
  /**
   * SocketProvider - Gerencia conexão Socket.IO com resiliência
   *
   * Estratégia de reconexão:
   * 1. Socket.IO tenta reconectar automaticamente (config em socket.js)
   * 2. Após 10 tentativas falhas, aguarda 30s e reinicia o ciclo
   * 3. Reset preventivo a cada 30min para evitar memory leaks
   *
   * Eventos monitorados:
   * - connect: conexão estabelecida
   * - disconnect: desconexão (com motivo)
   * - connect_error: erro ao conectar
   * - reconnect: reconexão bem-sucedida
   * - reconnect_attempt: tentativa de reconexão
   * - reconnect_failed: todas tentativas falharam
   */
  const SocketProvider = ({ children }) => {
    const MAX_BUFFER_SIZE = 10;
    const [dataBuffer, setDataBuffer] = useState([]);

    useEffect(() => {
      // Usuário fake — usado apenas quando `user` for null (ou seja, não autenticado).
      const fakeUser = { email: "demo@teste.com", displayName: "Demo User" };
      const activeUser = user || fakeUser;

      // Conecta ao servidor
      socket.connect();

      // ========== Handlers de conexão ==========
      const handleConnect = () => {
        console.log(`🔌 Conectado ao servidor Socket.io (usuário: ${activeUser.email})`);
        socket.emit("user", { email: activeUser.email });
      };

      const handleDisconnect = (reason) => {
        console.warn(`⚠️ Socket desconectado. Motivo: ${reason}`);
        // Motivos possíveis:
        // - "io server disconnect": servidor forçou desconexão
        // - "io client disconnect": cliente chamou socket.disconnect()
        // - "ping timeout": servidor não respondeu ao ping
        // - "transport close": conexão perdida
        // - "transport error": erro no transporte

        // Se o servidor forçou, precisamos reconectar manualmente
        if (reason === "io server disconnect") {
          console.log("🔄 Servidor forçou desconexão. Reconectando...");
          socket.connect();
        }
        // Outros motivos: Socket.IO reconecta automaticamente
      };

      const handleConnectError = (error) => {
        console.error(`❌ Erro de conexão Socket.io: ${error.message}`);
      };

      const handleReconnect = (attemptNumber) => {
        console.log(`🔄 Reconectado ao Socket.io após ${attemptNumber} tentativa(s)`);
        socket.emit("user", { email: activeUser.email });
      };

      const handleReconnectAttempt = (attemptNumber) => {
        console.log(`🔄 Tentativa de reconexão #${attemptNumber}...`);
      };

      const handleReconnectFailed = () => {
        console.error("❌ Falha ao reconectar após todas tentativas. Tentando novamente em 30s...");
        // Aguarda 30s e tenta reconectar novamente
        setTimeout(() => {
          console.log("🔄 Reiniciando tentativas de conexão...");
          socket.connect();
        }, 30000);
      };

      const handleDataReceived = (data) => {
        setDataBuffer((prevBuffer) => {
          const newBuffer = [...prevBuffer, data];
          if (newBuffer.length > MAX_BUFFER_SIZE) newBuffer.shift();
          return newBuffer;
        });
      };

      // ========== Registra listeners ==========
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("reconnect", handleReconnect);
      socket.on("reconnect_attempt", handleReconnectAttempt);
      socket.on("reconnect_failed", handleReconnectFailed);
      socket.on("data", handleDataReceived);

      // ♻️ Reset preventivo a cada 30 min (evita memory leaks em conexões longas)
      const resetInterval = setInterval(() => {
        console.log("♻️ Reset preventivo do Socket.io (30min)...");
        socket.disconnect();
        setDataBuffer([]);
        socket.connect();
      }, 30 * 60 * 1000);

      // ========== Cleanup ==========
      return () => {
        clearInterval(resetInterval);
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.off("reconnect", handleReconnect);
        socket.off("reconnect_attempt", handleReconnectAttempt);
        socket.off("reconnect_failed", handleReconnectFailed);
        socket.off("data", handleDataReceived);
        socket.disconnect();
      };
    }, [user]);

    return children;
  };

  //######################## Reload automático ########################
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Recarregando aplicação após 30 minutos...");
      window.location.reload();
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(interval);
  }, []);

  //#############################################################################
  // Enquanto checa o estado do user (undefined) mostra splash. Depois segue normalmente.
  if (loadingUser) return <SplashScreen />;

  return (
    <div className="app">
      {/* Mantemos AuthProvider para que o resto da aplicação continue recebendo o `user` real (ou null). */}
      <AuthProvider value={{ user }}>
        <SocketProvider>
          <HashRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {/* ✅ Suspense para lazy loading */}
              <Suspense fallback={<SplashScreen />}>
                <Routes>
                  {/* 
                    A estrutura de rota permanece: quando não há user real, seu app
                    continua a exibir a rota de Login/Register. Porém o socket já terá
                    sido conectado com o fakeUser (bypass) para permitir testes.
                  */}
                  <Route element={!user ? <Login /> : <Layout />}>
                    <Route path="/" element={<Navigate to="/operacao" replace />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/operacao" element={<Operacao />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/socket" element={<SocketPage />} />
                    <Route path="/receitas" element={<Receitas />} />
                    <Route path="/producao" element={<Producao />} />
                    <Route path="/alarmes" element={<Alarmes />} />
                    <Route path="/calibragem" element={<Calibragem />} />
                    <Route path="/config" element={<Config />} />
                  </Route>
                </Routes>
              </Suspense>
            </ThemeProvider>
          </HashRouter>
        </SocketProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
