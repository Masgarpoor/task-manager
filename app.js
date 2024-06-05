import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import getRoutes from "./get-routes.js";
import postRoutes from "./post-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticFilePath = path.join(__dirname, "static");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticFilePath));

app.use(getRoutes);
app.use(postRoutes);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
