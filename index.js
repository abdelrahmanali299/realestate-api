const express = require("express");
const cors = require("cors");
require("dotenv").config();

const notificationRoutes = require("./routes/notifications");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("Backend is running ✅"));

module.exports = app; // مهم لـ Vercel