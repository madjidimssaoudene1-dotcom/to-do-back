import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import { errorResponse } from "../utils/responseFormatter.js";

export async function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new Error("Token doesn't exist !");

    const verified = jwt.verify(token, process.env.AUTH_SECRET);
    if (!verified) throw new Error("Unverified Token used !");

    const user = await userModel.findById(verified._id).select("-password");
    if (!user) throw new Error("User not found !");

    req.user = user;
    next();
  } catch (error) {
    errorResponse(res, error, "Error validating token !");
  }
}
