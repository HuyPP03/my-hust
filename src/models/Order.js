import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    ticketId: String,
    userEmail: String,
    phone: String,
    cartProducts: Object,
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);
