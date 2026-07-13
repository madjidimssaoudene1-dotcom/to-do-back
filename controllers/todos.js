import { StatusCodes } from "http-status-codes";
import todoModel from "../models/todo.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";

export async function getTodos(req, res) {
  const userId = req.user._id;
  const { status, search, sortBy = "createdAt", order = "desc" } = req.query;
  try {
    // filters
    const filter = { user: userId };

    if (status === "completed") {
      filter.isComplete = true;
    } else if (status === "active") {
      filter.isComplete = false;
    }

    if (search) {
      filter.text = { $regex: search, $options: "i" };
    }

    // sorting
    const allowedSortFields = ["createdAt", "text"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const todos = await todoModel.find(filter).sort(sort);

    return successResponse(res, todos, "Todo fetched successfully !");
    // return res.status(StatusCodes.OK).json({
    //   success: true,
    //   message: "Todo fetched successfully !",
    //   data: todos,
    // });
  } catch (error) {
    errorResponse(res, error, "Failed to fetch todos !");
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ success: false, message: "Failed to fetch todos !", error });
  }
}

export async function createTodo(req, res) {
  const { text } = req.body;
  const userId = req.user._id;

  try {
    const newTodo = new todoModel({
      text: text.trim(),
      user: userId,
    });

    await newTodo.save();

    return successResponse(
      res,
      newTodo,
      "Todo created successfully !",
      StatusCodes.createTodo,
    );

    // return res.status(201).json({
    //   success: true,
    //   message: "Todo created successfully !",
    //   data: newTodo,
    // });
  } catch (error) {
    errorResponse(res, error, "Failed to create todos !");

    // res
    //   .status(500)
    //   .json({ success: false, message: "Failed to create todo !", error });
  }
}

export async function updateTodo(req, res) {
  const { id } = req.params;
  const { text, isComplete } = req.body;
  const userId = req.user._id;

  try {
    const updatedTodo = await todoModel.findOneAndUpdate(
      { _id: id, user: userId },
      { text, isComplete },
      { new: true },
    );

    if (!updatedTodo) {
      return errorResponse(
        res,
        null,
        "Todo not found !",
        StatusCodes.NOT_FOUND,
      );
      // res
      // .status(404)
      // .json({ success: false, message: "Todo not found" });
    }

    return successResponse(res, updatedTodo, "Todo updated successfully !");
  } catch (error) {
    errorResponse(res, error, "Failed to update todo !");
  }
}

export async function deleteTodo(req, res) {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deletedTodo = await todoModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedTodo) {
      return errorResponse(
        res,
        null,
        "Todo not found !",
        StatusCodes.NOT_FOUND,
      );
    }

    return successResponse(res, null, "Todo deleted successfully !");
  } catch (error) {
    errorResponse(res, error, "Failed to delete todo !");
  }
}

export async function deleteCompletedTodos(req, res) {
  const userId = req.user._id;

  try {
    const result = await todoModel.deleteMany({
      isComplete: true,
      user: userId,
    });

    successResponse(
      res,
      { deleteCount: result.deletedCount },
      "Completed todos deleted successfully !",
    );
  } catch (error) {
    errorResponse(res, error, "Failed to delete completed todos !");
  }
}
