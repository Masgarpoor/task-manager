import path from "path";
import { fileURLToPath } from "url";

import express from "express";

import getRoutes from "./routes/get-routes.js";
import postRoutes from "./routes/post-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "static");

const app = express();

app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(getRoutes);
app.use(postRoutes);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
