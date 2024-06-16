import express from "express";

import TaskController from "../controllers/task-controller.js";

const router = express.Router();

router.get("/tasks", TaskController.getTasks);
router.get("/tasks/:id", TaskController.getTaskById);
router.post("/tasks", TaskController.addTask)
router.put('/tasks/:id', TaskController.updateTask)
router.delete('/tasks/:id', TaskController.deleteTask)

export default router;
