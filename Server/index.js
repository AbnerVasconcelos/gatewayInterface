import express from "express";
import bodyParser from "body-parser";
// import mongoose from "mongoose"; // Código do MongoDB comentado
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import http from "http"; // Para criar servidores HTTP
import { Server } from "socket.io"; // Socket.IO
import { createClient } from "redis"; // Cliente Redis

// SQLITE
import sequelize from "./config/database.js";
// Importa os modelos (exemplo: Client e Receita)
import Client from "./models/Client.js";
import Receita from "./models/Receitas.js";

// Sincroniza as tabelas no SQLite (executa apenas uma vez)
sequelize
  .sync({ force: true })
  .then(() => console.log("Tabelas sincronizadas no SQLite"))
  .catch((err) =>
    console.error("Erro ao sincronizar tabelas no SQLite:", err)
  );

// Importação de rotas (ajuste conforme necessário)
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import receitasRoutes from "./routes/receitasRoutes.js";

// Configuração do ambiente
dotenv.config();
const app = express();

// ----------------------
// Configuração do Express (API)
// ----------------------
const APP_PORT = process.env.PORT || 5001;
const apiServer = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* CONFIGURANDO CORS NO EXPRESS */
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.196.45:3000",
  "http://192.168.196.100:3000",
  "http://192.168.196.33:3000",


];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Rotas
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.use("/receitas", receitasRoutes); // Rota para operações de receitas

// Inicializa o servidor da API
apiServer.listen(APP_PORT, () => {
  console.log(`Servidor Express rodando na porta ${APP_PORT}`);
});

// ----------------------
// Configuração do Socket.IO em servidor separado
// ----------------------
const SOCKET_PORT = process.env.SOCKET_PORT || 5002;
const socketServer = http.createServer();
const io = new Server(socketServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// REDIS SETUP
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Redis local por padrão
});

redisClient.on("error", (err) => {
  console.error("Erro de conexão com Redis:", err);
});

redisClient.connect().then(() => {
  console.log("Conectado ao servidor Redis.");
});

/* SOCKET.IO EVENT HANDLERS */
io.on("connection", (socket) => {
  console.log("###########################################");
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on("mensagem", (data) => {
    console.log("===========================================");
    console.log(`Dados recebidos: ${JSON.stringify(data)}`);
    console.log(`ID do socket: ${socket.id}`);
    console.log("===========================================");

    // Publica o JSON recebido no canal "channel3" do Redis
    redisClient
      .publish("channel3", JSON.stringify(data))
      .then((result) => {
        console.log(`Mensagem publicada no channel3. Resultado: ${result}`);
      })
      .catch((err) => {
        console.error("Erro ao publicar mensagem no channel3:", err);
      });
  });

  socket.on("disconnect", () => {
    console.log("-------------------------------------------");
    console.log(`Usuário desconectado: ${socket.id}`);
    console.log("-------------------------------------------");
  });
});

/* REDIS SUBSCRIBER */
(async () => {
  const subscriber = redisClient.duplicate();
  await subscriber.connect();
  console.log("Redis subscriber conectado.");

  subscriber.subscribe("channel2", (message) => {
    console.log("*******************************************");
    console.log(`Novo evento no Redis (channel2): ${message.toString()}`);
    io.emit("read", message.toString());
    console.log("Evento 'read' emitido para todos os sockets.");
    console.log("*******************************************");
  });
})();

// Inicializa o servidor do Socket.IO
socketServer.listen(SOCKET_PORT, () => {
  console.log(`Servidor Socket.IO escutando na porta ${SOCKET_PORT}`);
});
