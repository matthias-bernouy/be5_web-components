// client.ts
function connectToMaster(ip: string, port: number) {
  const socket = new WebSocket(`ws://${ip}:${port}`);

  socket.onopen = () => {
    console.log("Connecté au Master !");
    
    // Envoyer un message
    socket.send(JSON.stringify({
      type: "LOG_SYNC",
      sender: "Server#25",
      point: 256
    }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data.toString());
    console.log("Réponse du Master:", data);
  };

  socket.onerror = (error) => {
    console.error("Erreur WS:", error);
  };
  
  return socket;
}

// Utilisation
const clients = new Map<string, WebSocket>();

clients.set("25.65.125.62", connectToMaster("25.65.125.62", 5000));
clients.set("32.125.125.125", connectToMaster("32.125.125.125", 5000));
clients.set("54.125.125.125", connectToMaster("54.125.125.125", 5000));

// démarrer les workers
// ... (le code de démarrage des workers reste inchangé)
// passer en paramètres clients pour que tous les workers puissent y accéder
