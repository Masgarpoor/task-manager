import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import Task from './task.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlsFile = path.join(__dirname, "static", "html");

const router = express.Router();

router.get("/", (req, res) => {
  const tasks = Task.getAllTask();
  res.sendFile(path.join(htmlsFile, "template.html"));
});

export default router;
