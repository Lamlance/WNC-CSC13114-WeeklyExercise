import express from "express";
import actors_router from "./src/routes/api/actors.js";

const app = express();
const PORT = 3085;

app.get("/", (req, res) => {
  res.status(200).json({
    Hello: "World",
  });
});

app.use("/api/actors/", actors_router);

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running http://localhost:${PORT}`);
  } else {
    console.log("Error: ", err);
  }
});
