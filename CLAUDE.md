# gatewayInterface

Projeto com Server Node.js (Express + Socket.IO) e React App para interface de gateway industrial.

## Arquitetura

| Componente | Diretório | Porta | Descrição |
|------------|-----------|-------|-----------|
| Server | `Server/` | 5001 (API) / 5002 (Socket.IO) | Backend Node.js (Express, Socket.IO, SQLite) |
| React App | `reactApp/` | 3000 | Frontend React (build estático servido via `serve`) |
| Redis | externo | 6379 | Servidor Redis em 192.168.196.45 (rede ZeroTier) |

## Rede ZeroTier

O projeto opera em uma rede privada ZeroTier para comunicação segura entre componentes.

| Host | IP ZeroTier | Função |
|------|-------------|--------|
| Servidor principal | 192.168.196.2 | Server Node.js + React App |
| Servidor Redis | 192.168.196.45 | Broker de mensagens |
| Clientes | 192.168.196.x | Navegadores acessando o frontend |

**Importante**: Apenas dispositivos conectados à rede ZeroTier podem acessar os serviços.

## Gerenciamento de Processos (PM2)

O PM2 gerencia os processos com nomes únicos para evitar duplicação.

### Nomes dos processos

| Processo | Nome PM2 | Descrição |
|----------|----------|-----------|
| Backend | `gateway-server` | Server Node.js (portas 5001 + 5002) |
| Frontend | `gateway-react` | Serve build React (porta 3000) |

### Comandos PM2

```bash
# Iniciar todos os serviços
cd /home/delfos/gatewayInterface && npx pm2 start ecosystem.config.cjs

# Ver status
npx pm2 status

# Ver logs em tempo real
npx pm2 logs

# Reiniciar todos
npx pm2 restart all

# Reiniciar específico
npx pm2 restart gateway-server
npx pm2 restart gateway-react

# Parar todos
npx pm2 stop all

# Remover processos do PM2
npx pm2 delete all

# Salvar configuração para reinício automático
npx pm2 startup
npx pm2 save
```

### Evitar duplicação de processos

Sempre use os comandos PM2 para gerenciar os serviços. **Não use** `nohup node ...` diretamente, pois isso cria processos fora do controle do PM2.

Se houver processos duplicados:
```bash
# Listar todos os processos node
ps aux | grep node

# Matar processos órfãos (substitua <PID>)
kill <PID>

# Verificar portas em uso
ss -tlnp | grep -E ':(5001|5002|3000)'

# Reiniciar via PM2
npx pm2 delete all && npx pm2 start ecosystem.config.cjs
```

## Socket.IO - Lógica de Reconexão

O frontend implementa reconexão automática para lidar com instabilidades de rede.

### Configuração (reactApp/src/socket.js)

```javascript
{
  reconnection: true,
  reconnectionAttempts: 10,    // Máximo de tentativas
  reconnectionDelay: 1000,     // Delay inicial: 1s
  reconnectionDelayMax: 5000,  // Delay máximo: 5s
  timeout: 30000,              // Timeout conexão: 30s
}
```

### Fluxo de reconexão

1. **Conexão perdida** → Socket.IO detecta via ping timeout
2. **Tentativas automáticas** → Até 10 tentativas com delay crescente (1s → 5s)
3. **Todas falham** → Aguarda 30s e reinicia o ciclo
4. **Reset preventivo** → A cada 30min, reconecta para evitar memory leaks

### Eventos monitorados

| Evento | Descrição |
|--------|-----------|
| `connect` | Conexão estabelecida |
| `disconnect` | Desconexão (com motivo) |
| `connect_error` | Erro ao tentar conectar |
| `reconnect` | Reconexão bem-sucedida |
| `reconnect_attempt` | Tentativa de reconexão em andamento |
| `reconnect_failed` | Todas tentativas falharam |

### Logs no console do navegador

```
🔌 Conectado ao servidor Socket.io (usuário: user@email.com)
⚠️ Socket desconectado. Motivo: transport close
🔄 Tentativa de reconexão #1...
🔄 Reconectado ao Socket.io após 1 tentativa(s)
```

## Comandos Úteis

```bash
# Ver logs do servidor
tail -f /home/delfos/gatewayInterface/Server/server.log

# Ver logs do React
tail -f /home/delfos/gatewayInterface/reactApp/react.log

# Verificar portas em uso
ss -tlnp | grep -E ':(5001|5002|3000)'

# Testar conexão Socket.IO
curl "http://192.168.196.2:5002/socket.io/?EIO=4&transport=polling"

# Testar conexão Redis
redis-cli -h 192.168.196.45 -p 6379 ping

# Rebuild do React App
cd /home/delfos/gatewayInterface/reactApp && npm run build

# Reiniciar após rebuild
npx pm2 restart gateway-react
```

## Dependências

**Server:**
- Express, Socket.IO, Sequelize, SQLite3, MQTT, Redis

**React App:**
- MUI, Nivo charts, React Three Fiber, Socket.IO client, Redux Toolkit

## Troubleshooting

### Frontend não recebe dados

1. Verificar se está na rede ZeroTier
2. Verificar console do navegador (F12) para erros de conexão
3. Testar endpoint Socket.IO diretamente no navegador
4. Verificar logs do servidor: `npx pm2 logs gateway-server`

### Processos duplicados

```bash
# Matar todos e reiniciar via PM2
pkill -f "node.*gatewayInterface"
npx pm2 delete all
npx pm2 start ecosystem.config.cjs
```

### Porta em uso (EADDRINUSE)

```bash
# Encontrar processo usando a porta
lsof -i :5001
# Matar o processo
kill <PID>
```
