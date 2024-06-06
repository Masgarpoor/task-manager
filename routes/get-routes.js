import express from "express";

import { GetController } from "../controllers/task-controller.js";

const router = express.Router();

router.get("/", GetController.homeController);

export default router;
