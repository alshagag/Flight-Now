import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  verifyToken(req, res, async () => {
    try {
      const bookings = await prisma.booking.findMany({ where: { userId: req.user.userId } });
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
}
