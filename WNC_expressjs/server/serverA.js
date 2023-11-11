import { URL, URLSearchParams } from "url";
import actors_router from "../src/routes/api/actors.js";
import express from "express";
import fetch from "node-fetch";
const app = express();
const PORT = 3031;
app.listen(PORT, function () {
  console.log(`Server A at http://localhost:${PORT}`);
});

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function fetch_films_from_server_B(req, res, next) {
  const body =
    !req.body || Object.keys(req.body).length === 0
      ? {}
      : { body: JSON.stringify(req.body) };
  const data = await fetch("http://localhost:3032" + req.originalUrl, {
    method: req.method,
    ...body,
    headers: {
      authorization: res.locals.token || "",
    },
  });
  res.locals.serverB = data;
  return next();
}
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function forward_server_B_data(req, res) {
  /** @type {{serverB: Response | undefined}} */
  const { serverB } = res.locals;
  if (serverB) {
    return res.status(serverB.status).json(await serverB.json());
  } else {
    return res.status(500).json({ error: "Server error" });
  }
}

app.use(express.json());
app.use("/api/actor", actors_router);

//V1: Ko co authorization
app.use("/api/v1/film", fetch_films_from_server_B, forward_server_B_data);

//V2: Access token only
/** @type {string | undefined} */
let access_token_v2 = undefined;
const login_body = { user_name: "admin", pwd: "admin" };

app.use("/api/v2/login", async function (req, res) {
  const respond = await fetch("http://localhost:3032/api/v2/auth", {
    method: "post",
    body: Buffer.from(JSON.stringify(login_body)),
    headers: { "Content-Type": "application/json" },
  });
  const data = await respond.json();
  if (data.access_token) {
    access_token_v2 = data.access_token;
    return res.status(200).json({ access_token: access_token_v2 });
  } else {
    return res.status(respond.status).json(data);
  }
});

app.use(
  "/api/v2/film",
  async function (req, res, next) {
    res.locals.token = "Bearer " + (access_token_v2 || "");
    return next();
  },
  fetch_films_from_server_B,
  forward_server_B_data
);
