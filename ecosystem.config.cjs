/**
 * PM2 Ecosystem Configuration
 *
 * Este arquivo configura os processos gerenciados pelo PM2.
 * Usar nomes únicos evita duplicação de processos.
 *
 * Comandos:
 *   npx pm2 start ecosystem.config.cjs     # Inicia todos os serviços
 *   npx pm2 stop all                       # Para todos os serviços
 *   npx pm2 restart all                    # Reinicia todos os serviços
 *   npx pm2 logs                           # Ver logs em tempo real
 *   npx pm2 status                         # Ver status dos processos
 *   npx pm2 delete all                     # Remove todos os processos
 *
 * Para iniciar na inicialização do sistema:
 *   npx pm2 startup
 *   npx pm2 save
 */

module.exports = {
  apps: [
    {
      // ========== Backend Node.js ==========
      name: "gateway-server",          // Nome único do processo
      cwd: "./Server",                 // Diretório de trabalho
      script: "index.js",              // Script principal
      interpreter: "node",

      // Reinício automático
      watch: false,                    // Não reiniciar ao mudar arquivos
      autorestart: true,               // Reiniciar se crashar
      max_restarts: 10,                // Máximo de reinícios em caso de crash
      restart_delay: 5000,             // Aguardar 5s antes de reiniciar

      // Logs (paths absolutos)
      out_file: "/home/delfos/gatewayInterface/Server/server.log",
      error_file: "/home/delfos/gatewayInterface/Server/server-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      // Ambiente
      env: {
        NODE_ENV: "production",
        PORT: 5001,
        SOCKET_PORT: 5002,
      },
    },
    {
      // ========== Frontend React (serve estático) ==========
      name: "gateway-react",           // Nome único do processo
      cwd: "./reactApp",               // Diretório de trabalho
      script: "npx",
      args: "serve -s build -l 3000",
      interpreter: "none",             // npx não precisa de interpreter

      // Reinício automático
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,

      // Logs (paths absolutos)
      out_file: "/home/delfos/gatewayInterface/reactApp/react.log",
      error_file: "/home/delfos/gatewayInterface/reactApp/react-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      // Ambiente
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
