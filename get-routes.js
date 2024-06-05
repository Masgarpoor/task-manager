import path from "path";
import { fileURLToPath } from "url";

import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlsFile = path.join(__dirname, "static", "html");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(htmlsFile, "template.html"));
});

export default router;
