import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import seedRoute from "./routes/seed.js";
import authRoute from "./routes/auth.js";
import requestsRoute from "./routes/requests.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API is running" }));
app.use("/seed", seedRoute);
app.use("/auth", authRoute);
app.use("/requests", requestsRoute);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongo:27017/itml")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, "0.0.0.0", () => {
      console.log("Server running on http://0.0.0.0:5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
