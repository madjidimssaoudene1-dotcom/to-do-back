import { model, Schema } from "mongoose";

const todoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const todoModel = model("Todo", todoSchema);
export default todoModel;
