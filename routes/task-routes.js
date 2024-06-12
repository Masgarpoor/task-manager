import express from "express";

import TaskController from "../controllers/task-controller.js";

const router = express.Router();

router.get("/tasks", TaskController.getAllTasks);
router.get("/tasks/:id", TaskController.getTaskById);

export default router;
