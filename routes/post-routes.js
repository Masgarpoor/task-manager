import express from "express";

import { PostController as taskPostController} from "../controllers/task-controller.js";

const router = express.Router();

router.post("/add-task", taskPostController.addTask);
router.post("/toggle-task", taskPostController.toggleTask);
router.post("/edit-task", taskPostController.editTask);
router.post("/delete-task", taskPostController.deleteTask);

export default router;
