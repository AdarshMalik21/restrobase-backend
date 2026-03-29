import { Request, Response, Router } from "express";
import Content from "../models/Content";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const content = await Content.findOne();

    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    res.status(200).json(content);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put(
  "/",
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const content = await Content.findOne();

      if (!content) {
        res.status(404).json({ message: "Content not found" });
        return;
      }

      const {
        name,
        heroHeadline,
        heroSubtext,
        heroImage,
        menuItems,
        gallery,
        aboutText,
        aboutImage,
        statYears,
        statDishes,
        statRating,
        address,
        phone,
        hours,
        mapEmbed,
      } = req.body;

      content.name = name ?? content.name;
      content.heroHeadline = heroHeadline ?? content.heroHeadline;
      content.heroSubtext = heroSubtext ?? content.heroSubtext;
      content.heroImage = heroImage ?? content.heroImage;
      content.menuItems = menuItems ?? content.menuItems;
      content.gallery = gallery ?? content.gallery;
      content.aboutText = aboutText ?? content.aboutText;
      content.aboutImage = aboutImage ?? content.aboutImage;
      content.statYears = statYears ?? content.statYears;
      content.statDishes = statDishes ?? content.statDishes;
      content.statRating = statRating ?? content.statRating;
      content.address = address ?? content.address;
      content.phone = phone ?? content.phone;
      content.hours = hours ?? content.hours;
      content.mapEmbed = mapEmbed ?? content.mapEmbed;

      const updated = await content.save();

      res.status(200).json(updated);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;