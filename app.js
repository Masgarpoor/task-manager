import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import getRoutes from "./routes/get-routes.js";
import postRoutes from "./routes/post-routes.js";
import taskRoutes from "./routes/task-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "static");

const app = express();

app.use(express.static(staticPath));
app.use(express.json());


app.use(getRoutes);
app.use(postRoutes);
app.use(taskRoutes)

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

export {__dirname as rootPath}
