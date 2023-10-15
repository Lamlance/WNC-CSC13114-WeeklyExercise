import express from "express";
import actors_router from "./src/routes/api/actors.js";
import films_router from "./src/routes/api/films.js";
import apidoc_routes from "./src/routes/api_docs.js";

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

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running http://localhost:${PORT}`);
  } else {
    console.log("Error: ", err);
  }
});
