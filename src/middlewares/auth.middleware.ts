import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import prisma from "../libs/prisma";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized - No token provided" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized - User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requireRole = (role: "ADMIN" | "VENDOR" | "TRAVELLER") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ error: "Access Denied" });
      return;
    }

    next();
  };
};