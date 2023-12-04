import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
import ToDoRouter from "./ToDoRouter.js";

const app = express();
const PORT = 3030;
app.use(cors());
app.use(express.json());

function auth_check_mw(req, res, next) {
  const auth_header = req.headers.authorization;
  const access_token = auth_header && auth_header.split(" ")[1];

  if (!access_token)
    return res.status(401).json({ error: "Missing access token" });

  try {
    res.locals.token_payload = JSON.parse(
      Buffer.from(access_token.split(".")[1], "base64")
    );
    return next();
  } catch (e) {
    return res.status(401).json({ error: e });
  }
}

app.post("/login", function (req, res) {
  const { user_name, pwd } = req.body;
  if (!user_name || !pwd)
    return res.status(401).json({ error: "Invalid login credential" });
  if (user_name === "admin" && pwd === "admin")
    return res.status(200).json({
      access_token: jwt.sign(
        { user_id: 5 },
        process.env.SECRETE_KEY || "Secret key"
      ),
    });

  return res.status(403).json({ error: "Wrong credential" });
});

app.use("/auth", auth_check_mw, function (req, res) {
  return res.status(200).json({ message: "Valid authentication" });
});

app.use("/task", auth_check_mw, ToDoRouter);

app.listen(PORT, function () {
  console.log(`To do server: http://localhost:${PORT}`);
});
