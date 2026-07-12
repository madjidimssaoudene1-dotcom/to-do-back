import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("wrong email/password");

    const isPSWCorrect = await user.comparePassword(password);
    if (!isPSWCorrect) throw new Error("wrong email/password");

    const userInfo = {
      _id: user._id,
      createdAt: new Date(),
    };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET);

    user.password = undefined;

    return successResponse(
      res,
      user,
      "you have loggedin !",
      StatusCodes.OK,
      token,
    );
  } catch (error) {
    errorResponse(res, error, "Failed to login !", StatusCodes.BAD_REQUEST);
  }
}
export async function register(req, res) {
  const user = req.body;

  try {
    const createdUser = await userModel.create(user);

    const userInfo = {
      _id: createdUser._id,
      createdAt: new Date(),
    };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET);

    createdUser.password = undefined;

    return successResponse(
      res,
      createdUser,
      "you have registered !",
      StatusCodes.CREATED,
      token,
    );
  } catch (error) {
    errorResponse(res, error, "Failed to register !", StatusCodes.BAD_REQUEST);
  }
}

export async function checkUser(req, res) {
  const user = req.user;
  if (!user) {
    throw new Error("User not found");
  }
  successResponse(res, user, "User is authenticated");
}