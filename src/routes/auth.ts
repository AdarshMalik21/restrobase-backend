import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({ message: "JWT secret is not configured" });
      return;
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

    const token = jwt.sign({ adminId: admin._id.toString() }, secret, {
      expiresIn,
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;