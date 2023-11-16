import express from "express";
import films_router from "../src/routes/api/films.js";
import { validateToken } from "../src/middlewares/validateToken.js";
import login_router, { generateAccessToken } from "../src/routes/login.js";
import "dotenv/config";

import { serve } from "swagger-ui-express";
import crypto from "crypto";

import { MysqlClient } from "../src/db/connect.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
const PORT = 3032;
const [admin_name, admin_pwd] = ["admin", "admin"];

app.use(express.json());

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function check_secretkey(req, res, next) {
  const authHeader = req.headers["authorization"];
  const secretkey = authHeader && authHeader.split(" ")[1];

  if (!secretkey) {
    return res.status(401).json({ message: "Access denied" });
  }
  const [payload64, signature] = secretkey.split(".");
  const payload = JSON.parse(Buffer.from(payload64, "base64url"));

  if (Math.floor(new Date().getTime() / 1000) > (payload["iat"] + 120) * 1000) {
    return res.status(401).json({ error: "Token expired" });
  }

  if (req.originalUrl !== payload["url"]) {
    return res.status(401).json({ error: "Secret key path mismatch" });
  }

  if (
    signature !=
    crypto
      .createHmac("sha256", process.env.SECRETE_KEY)
      .update(payload64)
      .digest("base64url")
  ) {
    return res.status(401).json({ error: "Invalid signature" });
  }
  next();
}

app.use("/api/film", check_secretkey, films_router);

app.listen(PORT, function () {
  console.log(`Server B at http://localhost:${PORT}`);
});
