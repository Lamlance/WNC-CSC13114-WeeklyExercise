import express from "express";
import actors_router from "./src/routes/api/actors.js";
import films_router from "./src/routes/api/films.js";
import apidoc_routes from "./src/routes/api_docs.js";
import { WinstonLogger } from "./logger.js";
import { z, ZodError } from "zod";
import logMiddleware from "./src/utils/logMiddleware.js";
const app = express();
const PORT = 3085;

const ErrorSchema = z.object({
  message: z.string(),
  name: z.string(),
  stack: z.string().optional(),
  code: z.string().optional(),
  errno: z.number().optional(),
});

app.use(express.json());

app.use("/api-docs", apidoc_routes);

app.get("/", (req, res) => {
  res.status(200).json({
    Hello: "World",
  });
});

// routes
app.use("/api/actors/", logMiddleware, actors_router);

app.use("/api/films/", logMiddleware, films_router);

app.use(
  /**
   * @param {Error} err
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction}
   */
  function (err, req, res, next) {
    const err_data = ErrorSchema.safeParse(err);
    if (err_data.success) {
      res.locals.error = err_data.data;
      //WinstonLogger.error(err_data.data);
    } else {
      res.locals.error = err;
      //WinstonLogger.error(err);
    }
    //console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
);

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running http://localhost:${PORT}`);
    //WinstonLogger.info(`Server running http://localhost:${PORT}`);
  } else {
    console.log("Error: ", err);
  }
});
