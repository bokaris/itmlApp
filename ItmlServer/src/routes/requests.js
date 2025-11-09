import express from "express";
import Request from "../models/Request.js";
import User from "../models/User.js";

import countWorkingDays from "../utilities/countWorkingDays.js";

const router = express.Router();

/* ==========================================
   📄 GET all requests
   Optionally filter by ?email=employee@itml.com
   Also returns remaining annual leave info
========================================== */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    let remaining = null; // 👈 we'll fill this if email is given

    // If email is passed, get only that employee’s requests
    if (email) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
      query.employee = user._id;

      // 🧮 Calculate remaining annual leave
      const year = new Date().getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);

      const approvedAnnuals = await Request.find({
        employee: user._id,
        type: "annual",
        status: "approved",
        startDate: { $gte: startOfYear },
        endDate: { $lte: endOfYear },
      });

      const usedDays = approvedAnnuals.reduce((acc, r) => {
        const s = new Date(r.startDate);
        const e = new Date(r.endDate);
        return acc + countWorkingDays(s, e);
      }, 0);

      const totalAllowance = user.annualLeaveAllowance ?? 20;
      const remainingDays = Math.max(totalAllowance - usedDays, 0);

      remaining = {
        total: totalAllowance,
        used: usedDays,
        remaining: remainingDays,
      };
    }

    const requests = await Request.find(query)
      .populate("employee", "name email role")
      .populate("manager", "name email")
      .populate("hr", "name email")
      .sort({ createdAt: -1 });

    // ✅ If email provided → return both requests & remaining info
    if (email) {
      return res.json({ requests, remaining });
    }

    // Otherwise just all requests
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

    const usedDays = countWorkingDays(new Date(startDate), new Date(endDate));

    if (type === "annual" && employee.remainingAnnualLeaves < usedDays) {
      return res.status(400).json({
        error: `Not enough available days (${employee.remainingAnnualLeaves} left).`,
      });
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
    request.hrApproved = false;
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
      if (request.managerApproved) {
        request.status = "approved";

        const usedDays = countWorkingDays(
          new Date(request.startDate),
          new Date(request.endDate)
        );

        const employee = await User.findById(request.employee._id);
        if (employee.remainingAnnualLeaves < usedDays) {
          return res.status(400).json({
            error: `Not enough available days (${employee.remainingAnnualLeaves} left).`,
          });
        }

        employee.remainingAnnualLeaves -= usedDays;
        await employee.save();
      } else {
        request.status = "pending";
      }
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

/* ==========================================
   📅 GET approved annual leaves (for calendar)
   Everyone sees all approved annual requests
========================================== */
router.get("/calendar", async (req, res) => {
  try {
    const requests = await Request.find({
      type: "annual",
      status: "approved",
    })
      .populate("employee", "name email")
      .sort({ startDate: 1 });

    // 🧩 Format for frontend calendar
    const events = requests.map((r) => ({
      id: r._id,
      title: `${r.employee.name} on leave`,
      start: r.startDate,
      end: r.endDate,
      email: r.employee.email,
    }));

    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching calendar data:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

export default router;
