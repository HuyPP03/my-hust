const { Schema, models, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Category = models?.Category || model("Category", CategorySchema);
