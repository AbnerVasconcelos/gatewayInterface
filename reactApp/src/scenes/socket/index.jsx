import React, { useState } from 'react';
import { socket } from '../../socket';

const Socket = () => {
  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  // Função para enviar mensagens
  const sendMessage = () => {
    socket.emit("mensagem", { message });
    console.log("Mensagem enviada");
  };

  // Listener para o evento "connection" (se necessário)
  socket.on("connection", (data) => {
    console.log("Conexão estabelecida");
  });

  // Listener para o evento "read"
  socket.on("read", (data) => {
    const parsedData = JSON.parse(data);
    setMessageReceived(parsedData.temperatura);
    console.log(`Parsed data: ${parsedData.message} \n Evento 'read' recebido`);
  });

  return (
    <div className="App">
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message:</h1>
      {messageReceived}
    </div>
  );
};

export default Socket;
