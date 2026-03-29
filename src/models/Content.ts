import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem {
  name: string;
  description: string;
  price: number;
  category: "Starters" | "Mains" | "Desserts";
  image: string;
  isVeg: boolean;
}

export interface IContent extends Document {
  name: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImage: string;
  menuItems: IMenuItem[];
  gallery: string[];
  aboutText: string;
  aboutImage: string;
  statYears: string;
  statDishes: string;
  statRating: string;
  address: string;
  phone: string;
  hours: string;
  mapEmbed: string;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ["Starters", "Mains", "Desserts"],
  },
  image: { type: String, required: true },
  isVeg: { type: Boolean, required: true, default: true },
});

const ContentSchema = new Schema<IContent>(
  {
    name: { type: String, required: true, trim: true },
    heroHeadline: { type: String, required: true, trim: true },
    heroSubtext: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true },
    menuItems: { type: [MenuItemSchema], default: [] },
    gallery: { type: [String], default: [] },
    aboutText: { type: String, required: true, trim: true },
    aboutImage: { type: String, required: true },
    statYears: { type: String, required: true, trim: true },
    statDishes: { type: String, required: true, trim: true },
    statRating: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    hours: { type: String, required: true, trim: true },
    mapEmbed: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model<IContent>("Content", ContentSchema);

export default Content;
