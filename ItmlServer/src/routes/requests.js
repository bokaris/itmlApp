import express from "express";
import { requests, users } from "../data.js";

const router = express.Router();

// Get all requests
router.get("/", (req, res) => {
  res.json(requests);
});

// Create a new request
router.post("/", (req, res) => {
  const { email, type, startDate, endDate } = req.body;

  // Validate user
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Validate input
  if (!type || !startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Type, startDate, and endDate are required" });
  }

  // Create new request
  const newRequest = {
    id: Math.floor(Math.random() * 100000),
    type,
    status: "pending",
    employee: user.name,
    startDate,
    endDate,
  };

  requests.push(newRequest);
  res.status(201).json({ message: "Request created", request: newRequest });
});

// ✅ Approve a request
router.patch("/:id/approve", (req, res) => {
  const { id } = req.params;
  const request = requests.find((r) => r.id === Number(id));

  if (!request) return res.status(404).json({ error: "Request not found" });

  request.status = "approved";
  res.json({ message: "Request approved", request });
});

// ❌ Reject a request
router.patch("/:id/reject", (req, res) => {
  const { id } = req.params;
  const request = requests.find((r) => r.id === Number(id));

  if (!request) return res.status(404).json({ error: "Request not found" });

  request.status = "rejected";
  res.json({ message: "Request rejected", request });
});

export default router;
