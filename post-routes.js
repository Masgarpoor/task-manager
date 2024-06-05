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
        res.status(400).send(`<h1>${e.message}</h1>`);
      }
    } else {
      res.status(400).send("<h1>Invalid request. You must enter title.</h1>");
    }
  })
  .get((req, res) => {
    res.redirect("/");
  });

export default router;
