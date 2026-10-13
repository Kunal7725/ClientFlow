import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import ConnectedDataBase from "./config/database";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import userRoutes from "./routes/userRoutes";
import clientRoutes from "./routes/clientRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";






dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ClientFlow API is running",
  });
});





app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);




const startServer = async (): Promise<void> => {
  await ConnectedDataBase();

  app.listen(PORT, () => {
    console.log(`ClientFlow API running on http://localhost:${PORT}`);
  });
};

startServer();