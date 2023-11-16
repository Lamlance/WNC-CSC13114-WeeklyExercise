import { URL, URLSearchParams } from "url";
import express from "express";
import fetch from "node-fetch";

import crypto from "crypto";

import "dotenv/config";
import jwt from "jsonwebtoken";
import films_router from "../src/routes/api/films.js";
import {
  check_access_token,
  check_refresh_token,
  create_secrete_key,
  fetch_films_from_server_B,
  forward_server_B_data,
  refresh_access_token,
} from "./utils.js";
import { create_acess_token } from "../src/routes/login.js";
import actors_router from "../src/routes/api/actors.js";
import { validateLogin } from "../src/middlewares/validateLogin.js";

const app = express();
app.use(express.json());
const PORT = 3031;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function express_data_hook(req, res, next) {
  const old_send = res.send;
  res.send = function () {
    const new_obj = {
      data: JSON.parse(arguments[0]),
      access_token: res.locals.access_token,
    };
    arguments[0] = JSON.stringify(new_obj);
    old_send.apply(res, arguments);
  };
  next();
}

app.post("/login", validateLogin, async function (req, res) {
  /**@type {{user_name:string}} */
  const { user_name } = req.body;

  const token = jwt.sign({ user_name }, process.env.SECRETE_KEY, {
    expiresIn: "120s",
  });
  const refresh_token = jwt.sign({ user_name }, process.env.SECRETE_KEY, {
    expiresIn: "15d",
  });

  try {
    await MysqlClient("user_refresh_token").insert({
      refresh_token: refresh_token,
      user_id: res.locals.user_data.id,
    });
    return res
      .status(200)
      .json({ access_token: token, refresh_token: refresh_token });
  } catch (e) {
    return res.status(500).json({ error: "Server can't create refresh token" });
  }
});

app.use(
  "/api/",
  check_access_token,
  check_refresh_token,
  refresh_access_token,
  create_secrete_key,
  express_data_hook
);

app.use("/api/actor", actors_router);
app.use("/api/film", fetch_films_from_server_B, forward_server_B_data);

app.listen(PORT, function () {
  console.log(`Server A at http://localhost:${PORT}`);
});
