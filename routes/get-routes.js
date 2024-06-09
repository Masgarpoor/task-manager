import express from "express";

import { GetController } from "../controllers/task-controller.js";

const router = express.Router();

router.get("/", GetController.homeController);
router.get("/get-all-tasks", GetController.getAllTasksController);

export default router;
