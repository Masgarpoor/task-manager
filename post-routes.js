import express from "express";

import Task from "./task.js";

const router = express.Router();

router
  .route("/add-task")
  .post((req, res) => {
    const title = req.body.title;
    const completed = req.body.completed ? true : false;

    if (title) {
      try {
        const task = new Task(title, completed);
        task.save();
        res.redirect("/");
      } catch (e) {
        console.error(e);
        res.status(400).send(`<h1>${e.message}</h1>`);
      }
    } else {
      res.status(400).send("<h1>Invalid request. You must enter title.</h1>");
    }
  })
  .get((req, res) => {
    res.redirect("/");
  });

router.post("/toggle-task", (req, res) => {
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
        res.send("<h1>Can not save changes</h1>");
      }
    } else {
      res.status(404).send("<h1>Not found task</h1>");
    }
  } else {
    res.status(400).send("<h1>Invalid request</h1>");
  }
});
export default router;
