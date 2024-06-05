import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbname = process.env.DB_FILE;
const dbpath = path.join(__dirname, dbname);

export default class DB {
  static createDB() {
    if (fs.existsSync(dbpath)) {
      return false;
    }

    try {
      fs.writeFileSync(dbpath, "[]", "utf-8");
      return true;
    } catch (e) {
      throw new Error("Cann't create " + dbname);
    }
  }

  static resetDB() {
    try {
      fs.writeFileSync(dbpath, "[]", "utf-8");
      return true;
    } catch (e) {
      throw new Error("Cann't create " + dbname);
    }
  }

  static DBExists() {
    return fs.existsSync(dbpath);
  }

  static getTaskById(id) {
    let data;

    if (DB.DBExists()) {
      data = fs.readFileSync(dbpath);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        throw new Error(e.message);
      }
    }

    try {
      data = JSON.parse(data);

      const task = data.filter((task) => task.id === id);
      return task ? task[0] : false;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }

  static getTaskByTitle(title) {
    let data;

    if (DB.DBExists()) {
      data = fs.readFileSync(dbpath);
    } else {
      try {
        DB.createDB();
        return false;
      } catch (e) {
        throw new Error(e.message);
      }
    }

    try {
      data = JSON.parse(data);
      const task = data.find((item) => item.title.toLowerCase() === title.toLowerCase());

      return task ? task : false;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }

  static getAllTask() {
    let data;

    if (DB.DBExists()) {
      data = fs.readFileSync(dbpath);
    } else {
      try {
        DB.createDB();
        return [];
      } catch (error) {
        throw new Error(error.message);
      }
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (error) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }

  static saveTask(id = 0, title, completed=false) {
    id = Number(id);

    if (id < 0 || id !== parseInt(id)) {
      throw new Error("id must be an integer. equal or greater than zero.");
    } else if (title.length < 3 || typeof title !== "string") {
      throw new Error("title must contain at least 3 letters.");
    }

    const task = DB.getTaskByTitle(title);
    if (task && task.id !== id) {
      throw new Error("A task exists with this title.");
    }

    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(dbpath, 'utf-8');
    } else {
      try {
        DB.createDB();
        data = "[]";
      } catch (error) {
        throw new Error(error.message);
      }
    }

    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }

    /*
      id = 0 => create new task
      id != 0 => edit task
    */
    if (id === 0) {
      if (data.length === 0) {
        id = 1;
      } else {
        id = data[data.length - 1].id + 1;
      }
      data.push({
        id,
        title,
        completed,
      });
      data = JSON.stringify(data, null, "   ");
      try {
        fs.writeFileSync(dbpath, data, "utf-8");
        return id;
      } catch (e) {
        throw new Error("Can not save the task.");
      }
    } else {
      const indexOfTask = data.findIndex((item) => item.id === id);

      if (indexOfTask === -1) {
        throw new Error("Task not found.");
      }

      data[indexOfTask].id = id;
      data[indexOfTask].title = id;
      data[indexOfTask].completed = completed;

      data = JSON.stringify(data, null, "   ");
      try {
        fs.writeFileSync(dbpath, data, "utf-8");
        return id;
      } catch (e) {
        throw new Error("Can not save the task.");
      }
    }
  }

  static insertBulkData(data) {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (error) {
        throw new Error("Invalid data.");
      }
    }

    if (data instanceof Array) {
      data = JSON.stringify(data, null, "   ");
    } else {
      throw new Error("Invalid data.");
    }

    try {
      fs.writeFileSync(dbpath, data);
    } catch (error) {
      throw new Error("Can not write to DB file.");
    }
  }

  static deleteTask(id) {
    id = Number(id);
    if (id > 0 && parseInt(id) === id) {
      let data;
      try {
        data = fs.readFileSync(dbpath);
        data = JSON.parse(data);
      } catch (error) {
        throw new Error("Can not read DB file.");
      }

      const indexOfTask = data.findIndex((item) => item.id === id);

      if (indexOfTask !== -1) {
        data.splice(indexOfTask, 1);
        DB.insertBulkData(data);
        return true;
      }

      return false;
    } else {
      throw new Error("Task id must be a positive integer.");
    }
  }
}
