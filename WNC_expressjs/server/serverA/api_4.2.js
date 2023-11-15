import { Router } from "express";
import { validateLogin } from "../../src/middlewares/validateLogin.js";
import { validateToken } from "../../src/middlewares/validateToken.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import films_router from "../../src/routes/api/films.js";
import {
  check_access_token,
  check_refresh_token,
  create_secrete_key,
  fetch_films_from_server_B,
  forward_server_B_data,
  refresh_access_token,
} from "../utils.js";
import { MysqlClient } from "../../src/db/connect.js";
const api_router = Router();

api_router.post(
  "/refresh",
  check_refresh_token,
  refresh_access_token,
  function (req, res) {
    return res.status(200).json({
      access_token: res.locals.access_token,
    });
  }
);

api_router.post("/login", validateLogin, async function (req, res) {
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

api_router.use(
  "/film",
  check_access_token,
  function (req, res, next) {
    if (!res.locals.access_token || res.locals.access_token === "") {
      return res.status(401).json({
        error: res.locals.access_token_expired
          ? "Access token expired"
          : "Invalid access token",
      });
    }
    next();
  },
  create_secrete_key,
  fetch_films_from_server_B,
  forward_server_B_data
);

export { api_router as api_router_v4_2 };
