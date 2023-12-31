import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    ticketId: String,
    userEmail: String,
    phone: String,
    cartProducts: Object,
    sum: Number,
    discount: {
      type: Number,
      default: 0,
    },
    evaluate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);
