import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import serviceRequestRoutes from "@/routes/service-request.routes";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/service-requests", serviceRequestRoutes);

app.get("/", (_req, res) => {
  res.send("💼 OFFER-HUB backend is up and running!");
});

app.listen(port, () => {
  console.log(`🚀 OFFER-HUB server is live at http://localhost:${port}`);
  console.log("🌐 Connecting freelancers and clients around the world...");
  console.log("💼 Working...");
});
