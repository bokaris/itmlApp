// import express from "express";
// import { users } from "../data.js";

// const router = express.Router();

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find((u) => u.email === email && u.password === password);

//   if (!user) {
//     return res.status(401).json({ error: "Invalid email or password" });
//   }

//   res.json({
//     message: "Login successful",
//     user: { id: user.id, name: user.name, role: user.role, email: user.email },
//   });
// });

// export default router;
