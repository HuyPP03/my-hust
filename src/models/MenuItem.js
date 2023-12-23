const { Schema, models, model, default: mongoose } = require("mongoose");

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});
const ArtistSchema = new Schema({
  name: String,
});

const ManagementSchema = new Schema({
  name: String,
  phone: String,
  email: String,
});
const CatagorySchema = new Schema({
  category: String,
});

const MenuItemSchema = new Schema(
  {
    image: { type: String },
    name: { type: String },
    description: { type: String },
    categories: { type: [CatagorySchema] },
    price: { type: Number },
    types: { type: [ExtraPriceSchema] },
    artists: { type: [ArtistSchema] },
    managements: { type: [ManagementSchema] },
    date: { type: Date },
    address: { type: String },
    time: { type: String },
  },
  {
    timestamps: true,
  }
);

export const MenuItem = models?.MenuItem || model("MenuItem", MenuItemSchema);
