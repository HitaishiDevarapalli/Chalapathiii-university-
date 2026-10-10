import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";

declare module "express-session" {
  interface SessionData {
    adminId?: number;
  }
}

const router = Router();

// POST /login - Authenticate admin user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    req.session.adminId = user.id;

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during login",
    });
  }
});

// POST /logout - Destroy current session
router.post("/logout", async (req: Request, res: Response) => {
  try {
    if (!req.session) {
      return res.status(200).json({ success: true });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Logout session destroy error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to log out",
        });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during logout",
    });
  }
});

// GET /me - Return authenticated user details or 401
router.get("/me", async (req: Request, res: Response) => {
  try {
    const adminId = req.session?.adminId;

    if (!adminId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found or session expired",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get /me error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
