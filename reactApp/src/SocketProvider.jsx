import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "./socket";

// polyfill simples p/ requestIdleCallback no navegador que não tiver
const ric = window.requestIdleCallback || ((cb) => setTimeout(() => cb({ timeRemaining: () => 0 }), 1));
const cic = window.cancelIdleCallback || clearTimeout;

const SocketCtx = createContext({ data: [] });

export function SocketProvider({ user, children }) {
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
        // se a aba não está visível, espere ficar visível para conectar
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
            // snapshot para a UI (1 render por frame no máx.)
            setData(bufferRef.current.slice());
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

export const useSocketData = () => {
  const ctx = useContext(SocketCtx);
  return ctx.data;
};
