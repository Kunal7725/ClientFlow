import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectedDataBase from "./config/database";
import testRoutes from "./routes/testRoutes";
import healthRouter from "./routes/health";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);

const startServer = async (): Promise<void> => {
  await ConnectedDataBase();

  app.listen(PORT, () => {
    console.log(`ClientFlow API running on http://localhost:${PORT}`);
  });
};

startServer();