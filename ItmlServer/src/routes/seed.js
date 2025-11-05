import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await User.deleteMany({}); // clear old users

    const users = await User.insertMany([
      {
        name: "John Employee",
        email: "employee@itml.com",
        role: "employee",
        password: "123456",
      },
      {
        name: "Maria Manager",
        email: "manager@itml.com",
        role: "manager",
        password: "123456",
      },
      {
        name: "Helen HR",
        email: "hr@itml.com",
        role: "hr",
        password: "123456",
      },
    ]);

    res.json({ message: "✅ Dummy users created", users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to seed users" });
  }
});

export default router;
