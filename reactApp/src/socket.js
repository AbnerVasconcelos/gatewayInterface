import { io } from 'socket.io-client';

// URL do servidor Socket.IO na rede ZeroTier
// O servidor roda em 192.168.196.2:5002 (IP ZeroTier do servidor)
// Clientes devem estar na mesma rede ZeroTier para conectar
const URL = 'http://192.168.196.2:5002';

/**
 * Configuração do Socket.IO Client com resiliência
 *
 * Estratégia de reconexão:
 * - Tenta reconectar automaticamente até 10 vezes
 * - Delay inicial de 1s, aumentando até máximo de 5s
 * - Timeout de conexão aumentado para 30s (redes ZeroTier podem ter latência)
 * - Após falhar todas tentativas, aguarda 30s e tenta novamente
 */
export const socket = io(URL, {
  autoConnect: false,

  // Reconexão automática
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,      // Delay inicial: 1s
  reconnectionDelayMax: 5000,   // Delay máximo: 5s

  // Timeout aumentado para redes com latência (ZeroTier)
  timeout: 30000,               // 30s para estabelecer conexão

  // Transports - preferir websocket, fallback para polling
  transports: ['websocket', 'polling'],
});
