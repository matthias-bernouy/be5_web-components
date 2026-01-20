import type { NetworkMessage } from "./network";

const PORT = 5000;
const NODE_NAME = process.env.NODE_NAME || "Server#Unknown";

// Stratégie Multi-Cœur : Bun permet de partager le port 
// en lançant plusieurs instances du même script.

const clients = new Map<string, any>();

const startServer = () => {
  Bun.listen<NetworkMessage>({
    hostname: "0.0.0.0",
    port: PORT,
    socket: {
      async data(socket, data) {
        try {
          const text = new TextDecoder().decode(data);
          const message: NetworkMessage = JSON.parse(text);

          console.log(`[${NODE_NAME}] [Core ${process.pid}] Reçu: ${message.type}`);

          if (message.type === 'SHARD_STOP_REQUEST') {
            // Logique de pause des opérations
            socket.write(JSON.stringify({ 
                type: 'SHARD_STOPPED_OK', 
                sender: NODE_NAME 
            }));
          }
        } catch (e) {
          console.error("Erreur de parsing JSON");
        }
      },
      open(socket) {
        console.log(`[${NODE_NAME}] [Core ${process.pid}] Nouvelle connexion établie.`);
        clients.set(socket.remoteAddress + ":" + socket.remotePort, socket);
      },
      close(socket) {
        console.log(`[${NODE_NAME}] [Core ${process.pid}] Connexion fermée.`);
        clients.delete(socket.remoteAddress + ":" + socket.remotePort);
        // Optionnel: Garder une trace des connexions actives
      }
    },
  });
};

startServer();