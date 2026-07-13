import { Router } from "express";
import {
  createTodo,
  deleteCompletedTodos,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todos.js";
import { checkAuth } from "../middleware/auth.js";

const todoRouter = Router();

todoRouter.use(checkAuth);
// todoRouter.get("/", (req, res) => {});
// todoRouter.post("/", (req, res) => {});

todoRouter.route("/").get(getTodos).post(createTodo);

todoRouter.delete("/completed", deleteCompletedTodos);
// todoRouter.put("/:id", (req, res) => {});
// todoRouter.delete("/:id", (req, res) => {});

todoRouter.route("/:id").put(updateTodo).delete(deleteTodo);

export default todoRouter;
