import express from "express";
import Request from "../models/Request.js";
import User from "../models/User.js";

const router = express.Router();

/* ==========================================
   📄 GET all requests
   Optionally filter by ?email=employee@itml.com
========================================== */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    // If email is passed, get only that employee’s requests
    if (email) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
      query.employee = user._id;
    }

    const requests = await Request.find(query)
      .populate("employee", "name email role")
      .populate("manager", "name email")
      .populate("hr", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

/* ==========================================
   ➕ POST create new request
========================================== */
router.post("/", async (req, res) => {
  try {
    const { email, type, startDate, endDate } = req.body;

    if (!type || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Type, startDate, and endDate are required" });
    }

    // Find the employee
    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find manager and HR
    const manager = await User.findOne({ role: "manager" });
    const hr = await User.findOne({ role: "hr" });

    // Default approvals
    let managerApproved = null;
    let hrApproved = null;

    // Create new Request
    const newRequest = new Request({
      type,
      employee: employee._id,
      manager: manager._id,
      hr: hr._id,
      startDate,
      endDate,
      managerApproved,
      hrApproved,
      status: "pending",
    });

    await newRequest.save();

    res.status(201).json({
      message: "✅ Request created successfully",
      request: await newRequest.populate("employee", "name email role"),
    });
  } catch (err) {
    console.error("❌ Error creating request:", err);
    res.status(500).json({ error: "Failed to create request" });
  }
});

/* ==========================================
   ✅ PATCH manager approve
========================================== */
router.patch("/:id/manager-approve", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.type === "remote") {
      return res
        .status(403)
        .json({ error: "Manager cannot approve remote requests" });
    }

    request.managerApproved = true;

    // Annual: only final if HR already approved
    if (request.hrApproved) request.status = "approved";

    await request.save();
    res.json({ message: "✅ Manager approved request", request });
  } catch (err) {
    console.error("❌ Error approving request:", err);
    res.status(500).json({ error: "Failed to approve request" });
  }
});

/* ==========================================
   ❌ PATCH manager reject
========================================== */
router.patch("/:id/manager-reject", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.type === "remote") {
      return res
        .status(403)
        .json({ error: "Manager cannot reject remote requests" });
    }

    request.managerApproved = false;
    request.status = "rejected";

    await request.save();
    res.json({ message: "❌ Manager rejected request", request });
  } catch (err) {
    console.error("❌ Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request" });
  }
});

/* ==========================================
   ✅ PATCH HR approve
========================================== */
router.patch("/:id/hr-approve", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.hrApproved = true;

    if (request.type === "annual") {
      request.status = request.managerApproved ? "approved" : "pending";
    } else if (request.type === "remote") {
      request.status = "approved";
    }

    await request.save();
    res.json({ message: "✅ HR approved request", request });
  } catch (err) {
    console.error("❌ Error approving request:", err);
    res.status(500).json({ error: "Failed to approve request" });
  }
});

/* ==========================================
   ❌ PATCH HR reject
========================================== */
router.patch("/:id/hr-reject", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.hrApproved = false;
    request.status = "rejected";

    await request.save();
    res.json({ message: "❌ HR rejected request", request });
  } catch (err) {
    console.error("❌ Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request" });
  }
});

export default router;
