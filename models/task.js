import DB from "./db.js";

export default class Task {
  #id;
  #title;
  #completed;

  constructor(title, completed) {
    this.title = title;
    this.completed = completed;
  }

  set title(value) {
    if (value.length >= 3 && typeof value === "string") {
      this.#title = value;
    } else {
      throw new Error("Title must be atleast 3 charachter.");
    }
  }

  set completed(value) {
    this.#completed = Boolean(value);
  }

  get title() {
    return this.#title;
  }

  get completed() {
    return this.#completed;
  }

  get id() {
    return this.#id;
  }

  save() {
    try {
      const id = DB.saveTask(this.#id, this.#title, this.#completed);
      this.#id = id;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  static getTaskById(id) {
    const task = DB.getTaskById(id);
    if (task) {
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      return item;
    } else {
      return false;
    }
  }

  static getTaskByTitle(title) {
    const task = DB.getTaskByTitle(title);
    if (task) {
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      return item;
    } else {
      return false;
    }
  }

  static getAllTask() {
    const tasks = [];
    const data = DB.getAllTask();

    for (let task of data) {
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      tasks.push(item);
    }

    return tasks;
  }

  static deleteTask(id) {
    try {
      return DB.deleteTask(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
