import express from "express";
import actors_router from "./src/routes/api/actors.js";
import films_router from "./src/routes/api/films.js";
import apidoc_routes from "./src/routes/api_docs.js";
import { WinstonLogger } from "./logger.js";

const app = express();
const PORT = 3085;

app.use(express.json());
app.use("/api-docs", apidoc_routes);

app.get("/", (req, res) => {
  res.status(200).json({
    Hello: "World",
  });
});

// routes
app.use("/api/actors/", actors_router);

app.use("/api/films/", films_router);

/**
 * @function send_server_error
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction}
 */
app.use(function send_server_error(err, req, res, next) {
  //console.error(err);
  WinstonLogger.error(err);
  return res.status(500).json({ error: "Server error" });
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running http://localhost:${PORT}`);
  } else {
    console.log("Error: ", err);
  }
});
