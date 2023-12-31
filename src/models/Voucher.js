import { model, models, Schema } from "mongoose";

const VoucherSchema = new Schema(
  {
    voucherCode: String,
    name: String,
    toTime: Date,
    fromTime: Date,
    percent: {
      type: Number,
      min: 0,
      max: 100,
      required: false,
    },
    amountMoney: {
      type: Number,
      required: false,
    },
    quantity: Number,
  },
  { timestamps: true }
);

export const Voucher = models?.Voucher || model("Voucher", VoucherSchema);
