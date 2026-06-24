import http from 'http';
import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { setupSocket } from "./socket/index.js";

dotenv.config();

connectDB().then(async () => {
  const PORT = process.env.PORT || 5000;

  app.use(cookieParser());

  const httpServer = http.createServer(app);
  setupSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});