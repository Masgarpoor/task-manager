import Task from "../models/task.js";

export default class TaskController {
  static getTasks(req, res) {
    let page = 1;
    let limit = 4;
    let finished = undefined;
    let search = "";

    if (req.query.page > 0) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit > 0) {
      limit = parseInt(req.query.limit);
    }
    if (req.query.search) {
      search = req.query.search;
    }
    if (req.query.finished === "true" || req.query.finished === "false") {
      finished = req.query.finished === "true" ? true : false;
    }
    try {
      let tasks = Task.getAllTask();
      tasks = tasks.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
      if (finished !== undefined) {
        tasks = tasks.filter((item) => item.completed === finished);
      }

      const totalTasks = tasks.length;

      const start = (page - 1) * limit;
      const end = start + limit;
      tasks = tasks.slice(start, end);

      res.json({
        success: true,
        body: tasks,
        message: "All tasks fetcehd!",
        totalTasks,
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

  static addTask(req, res) {
    const title = req.body.title;
    const completed = req.body.isCompleted ? true : false;

    if (title) {
      if (title.length < 3) {
        return res.status(400).send({
          success: false,
          body: null,
          message: "Title must contains 3 characters or more",
        });
      } else if (Task.getTaskByTitle(title)) {
        return res.status(409).json({
          success: false,
          body: null,
          message: "A task already exists with this title",
        });
      }
      try {
        const task = new Task(title, completed);
        task.save();
        res.status(201).json({
          success: true,
          body: task,
          message: "Task created",
        });
      } catch (e) {
        res.status(500).josn({
          success: false,
          body: null,
          message: "Internal Server Error",
        });
      }
    } else {
      res.status(400).send({
        success: false,
        body: null,
        message: "Please send new task title.",
      });
    }
  }

  static updateTask(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (completed !== undefined && title) {
      if (title.length < 3) {
        return res.status(400).json({
          success: false,
          body: null,
          message: "Title must contains 3 characters or more",
        });
      }

      let task = Task.getTaskByTitle(title);
      if (task && task.id != id) {
        return res.status(409).json({
          success: false,
          body: null,
          message: "A task already exists with this title",
        });
      }

      task = Task.getTaskById(Number(id));
      if (task) {
        try {
          task.title = title;
          task.completed = completed;
          task.save();
          res.json({
            success: true,
            body: task,
            message: "Task updated",
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            body: null,
            message: "Internal Server Error",
          });
        }
      }
    } else {
      res.status(400).json({
        success: false,
        body: null,
        message: "Please enter the title and copmleted",
      });
    }
  }

  static deleteTask(req, res) {
    const { id } = req.params;
    try {
      if (Task.deleteTask(id)) {
        res.json({
          success: true,
          body: null,
          message: "The task deleted",
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
        message: error.message,
      });
    }
  }
}
