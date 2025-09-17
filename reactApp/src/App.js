// App.jsx
import React, { useEffect, useMemo, Suspense, lazy, useState, createContext, useContext, useRef } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";

import { AuthProvider } from "./context/AuthContext";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { useAuthentication } from "./hooks/useAuthentication";

import { socket } from "./socket"; // sua instância configurada do socket.io-client

/* ======================= SocketProvider (fora do App) ======================= */
// Polyfill simples
const ric = window.requestIdleCallback || ((cb) => setTimeout(() => cb({ timeRemaining: () => 0 }), 1));
const cic = window.cancelIdleCallback || clearTimeout;

const SocketCtx = createContext({ data: [] });
export const useSocketData = () => useContext(SocketCtx).data;

function SocketProvider({ user, children }) {
  const MAX_BUFFER_SIZE = 10;

  const bufferRef = useRef([]);
  const rafRef = useRef(0);
  const startedRef = useRef(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;
    if (startedRef.current) return; // evita dupla conexão no StrictMode (dev)
    startedRef.current = true;

    let cleanupSocket = null;
    const idleId = ric(() => {
      if (document.visibilityState !== "visible") {
        const onVisible = () => {
          if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", onVisible);
            cleanupSocket = start();
          }
        };
        document.addEventListener("visibilitychange", onVisible);
        return;
      }
      cleanupSocket = start();
    });

    function start() {
      socket.connect();
      socket.emit("user", { email: user.email });

      const onData = (pkg) => {
        const next = bufferRef.current.concat(pkg);
        if (next.length > MAX_BUFFER_SIZE) next.splice(0, next.length - MAX_BUFFER_SIZE);
        bufferRef.current = next;

        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = 0;
            setData(bufferRef.current.slice()); // 1 render por frame
          });
        }
      };

      socket.on("data", onData);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        socket.off("data", onData);
        socket.disconnect();
        startedRef.current = false;
      };
    }

    return () => {
      cic(idleId);
      if (cleanupSocket) cleanupSocket();
    };
  }, [user]);

  return <SocketCtx.Provider value={{ data }}>{children}</SocketCtx.Provider>;
}
/* ========================================================================== */

/* ======================== Lazy imports (code-splitting) ==================== */
const Layout     = lazy(() => import("scenes/layout"));
const Admin      = lazy(() => import("scenes/admin"));
const Login      = lazy(() => import("pages/Login/Login"));
const Register   = lazy(() => import("pages/Register/Register"));
const Alarmes    = lazy(() => import("scenes/Alarmes"));
const Calibragem = lazy(() => import("scenes/Calibragem"));
const Config     = lazy(() => import("scenes/Config"));
const Producao   = lazy(() => import("scenes/Produção"));
const Receitas   = lazy(() => import("scenes/Receitas"));
const Operacao   = lazy(() => import("scenes/operacao"));
const SocketPage = lazy(() => import("scenes/socket"));
/* ========================================================================== */

export default function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // Auth
  const { auth } = useAuthentication();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // garante persistência da sessão
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, [auth]);

  // Gate para rotas privadas (evita redirect antes do primeiro evento da auth)
  const Private = ({ children }) => {
    if (!authReady) return <div style={{ padding: 16 }}>Carregando…</div>;
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider value={{ user }}>
          <SocketProvider user={user}>
            <HashRouter>
              <Suspense fallback={<div style={{ padding: 16 }}>Carregando…</div>}>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Rotas protegidas */}
                  <Route
                    path="/"
                    element={
                      <Private>
                        <Layout />
                      </Private>
                    }
                  >
                    <Route index element={<Navigate to="/operacao" replace />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="operacao" element={<Operacao />} />
                    <Route path="socket" element={<SocketPage />} />
                    <Route path="receitas" element={<Receitas />} />
                    <Route path="producao" element={<Producao />} />
                    <Route path="alarmes" element={<Alarmes />} />
                    <Route path="calibragem" element={<Calibragem />} />
                    <Route path="config" element={<Config />} />
                  </Route>

                  {/* Fallback para rotas desconhecidas */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </HashRouter>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}
