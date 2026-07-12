import { Router } from "express";
import { checkUser, login, register } from "../controllers/auth.js";
import { checkAuth } from "../middleware/auth.js";

const authRouter = Router();

authRouter.get("/", checkAuth, checkUser);
authRouter.post("/login", login);
authRouter.post("/register", register);

export default authRouter;