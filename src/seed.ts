import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin";
import Content from "./models/Content";

dotenv.config();

async function seed(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");

    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin user already exists — skipping admin seed");
    } else {
      const admin = new Admin({
        username: "admin",
        password: "admin1234",
      });
      await admin.save();
      console.log("Admin user created successfully");
      console.log("Username: admin");
      console.log("Password: admin1234");
    }

    const existingContent = await Content.findOne();

    if (existingContent) {
      console.log("Content already exists — skipping content seed");
    } else {
      const content = new Content({
        name: "RestroBase",
        heroHeadline: "Authentic flavours,\nevery single plate.",
        heroSubtext:
          "Family recipes since 1998. Dine in, takeaway, and catering for every occasion.",
        heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        menuItems: [
          {
            name: "Paneer Tikka",
            description: "Smoky cottage cheese with mint chutney",
            price: 220,
            category: "Starters",
            image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
            isVeg: true,
          },
          {
            name: "Butter Chicken",
            description: "Slow-cooked in tomato and cream gravy",
            price: 360,
            category: "Mains",
            image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
            isVeg: false,
          },
          {
            name: "Dal Makhani",
            description: "Creamy black lentils simmered overnight",
            price: 180,
            category: "Mains",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
            isVeg: true,
          },
          {
            name: "Gulab Jamun",
            description: "Soft milk dumplings in rose syrup",
            price: 120,
            category: "Desserts",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
            isVeg: true,
          },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        ],
        aboutText:
          "We started as a small family dhaba in 1998 and have grown into one of Ghaziabad's most loved restaurants. Every dish is made from scratch with spices sourced directly from local farms.",
        aboutImage:
          "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800",
        statYears: "25+",
        statDishes: "40+",
        statRating: "4.8★",
        address: "12, Raj Nagar Extension, Ghaziabad, UP 201017",
        phone: "+91 98765 43210",
        hours: "Mon to Sun, 11am to 11pm",
        mapEmbed:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.0!2d77.4!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
      });

      await content.save();
      console.log("Initial content created successfully");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    console.log("Seed completed successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seed failed:", error.message);
    }
    process.exit(1);
  }
}

seed();