import "dotenv/config";
import express from "express";
import morgan from "morgan";
import todoRouter from "./routes/todos.js";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";

const app = express();
const PORT = 3000;

// middlewares
app.set("trust proxy", true);

app.use(
  cors({
    credentials: true,
    origin: new RegExp(process.env.CORS_ORIGIN || "http://localhost:5173"),
  }),
);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// routes
app.use("/auth", authRouter);
app.use("/todos", todoRouter);

// not found
app.use(notFoundHandler);
// error route
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server connected to http://localhost:${PORT}`);
  });
});
