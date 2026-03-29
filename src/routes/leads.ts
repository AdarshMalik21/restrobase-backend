import { Request, Response, Router } from "express";
import Lead from "../models/Lead";
import { verifyToken, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    res.status(400).json({ message: "Name, phone and message are required" });
    return;
  }

  try {
    const lead = new Lead({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    const saved = await lead.save();

    res.status(201).json({
      message: "Lead saved successfully",
      lead: saved,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/",
  verifyToken,
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });

      res.status(200).json(leads);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;