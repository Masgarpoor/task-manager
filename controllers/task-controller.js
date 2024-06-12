import path from "path";

import Task from "../models/task.js";
import { rootPath } from "../app.js";

export class GetController {
  static homeController(req, res) {
    res.sendFile(path.join(rootPath, "views", "home.html"));
  }

  static getAllTasksController(req, res) {
    try {
      const tasks = Task.getAllTask(true);
      res.json(tasks);
    } catch (error) {
      res.status(500).json("Internal Server Error!");
    }
  }
}

export class PostController {
  static addTask(req, res) {
    const title = req.body.title;
    const completed = req.body.isCompleted ? true : false;
    if (title) {
      try {
        const task = new Task(title, completed);
        task.save();
        res.json(Number(task.id));
      } catch (e) {
        console.error(e);
        res.status(400).send(`${e.message}`);
      }
    } else {
      res.status(400).send("Invalid request. You must enter title.");
    }
  }

  static toggleTask(req, res) {
    const id = Number(req.body.id);
    if (id) {
      const task = Task.getTaskById(id);
      if (task) {
        task.completed = !task.completed;
        try {
          task.save();
          res.json(true);
        } catch (error) {
          console.error(error);
          res.send("Can not save changes");
        }
      } else {
        res.status(404).json(404);
      }
    } else {
      res.status(400).json(400);
    }
  }

  static editTask(req, res) {
    const id = Number(req.body.id);
    const title = req.body.title;

    if (id && title) {
      const task = Task.getTaskById(id);
      if (task) {
        try {
          task.title = title;
          task.save();
          res.json(true);
        } catch (error) {
          res.status(400).json(error.message);
        }
      } else {
        res.status(404).json(404);
      }
    } else {
      res.status(400).json(400);
    }
  }

  static deleteTask(req, res) {
    const id = Number(req.body.id);
    if (id) {
      try {
        const resultOfDelete = Task.deleteTask(id);
        res.json(resultOfDelete);
      } catch (error) {
        res.status(500).json(error.message);
      }
    } else {
      res.status(400).json(400);
    }
  }
}

export default class TaskController {
  static getAllTasks(req, res) {
    try {
      const tasks = Task.getAllTask();
      res.json({
        success: true,
        body: tasks,
        message: "All tasks fetcehd!",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        body: null,
        message: "Internal Server Error!",
      });
    }
  }

  static getTaskById(req, res) {
    try {
      const task = Task.getTaskById(Number(req.params.id));
      if (task) {
        res.json({
          success: true,
          body: task,
          message: "The task fetched successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          body: null,
          message: "Task not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        body: null,
        message: "Internal Server Error!",
      });
    }
  }
}
