import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { syncUser } from "../services/auth.service";
import { get } from "node:http";

export const syncUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized User" });
      return;
    }

    const user = await syncUser(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
