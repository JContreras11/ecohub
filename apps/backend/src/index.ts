import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.BACKEND_PORT || process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║        🌿 EcoHub Backend API 🌿          ║
  ║      Running on ${HOST}:${PORT}         ║
  ╚══════════════════════════════════════════╝
  `);
});
