import { model, models, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    ticketId: String,
    userName: String,
    userImage: String,
    comment: String,
    numberStar: Number,
  },
  { timestamps: true }
);

export const Comment = models?.Comment || model("Comment", CommentSchema);
