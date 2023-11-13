import { URL, URLSearchParams } from "url";
import actors_router from "../src/routes/api/actors.js";
import express from "express";
import fetch from "node-fetch";

import crypto from "crypto";

import "dotenv/config";
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

const login_body_Client = { user_name: "ServerA", pwd: "ServerA" };

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

//V3 Secret key


/** @type {string | undefined} 
 * @param {object} header
 * @param {object} payload
 */
app.use("/api/v3/film",
  async function (req, res, next) {
    const payload = {
      iat: Math.floor((new Date().getTime()) / 1000),
      url: "/api/v3/film",
    };
    // console.log(process.env.SECRETE_KEY)    
    const payload64 = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
    const signature = crypto.createHmac("sha256", process.env.SECRETE_KEY).update(payload64).digest("base64url");
    const secretkey = payload64 + "." + signature;
    res.locals.token = "Key " + (secretkey || "");

    return next();
  },
  fetch_films_from_server_B,
  forward_server_B_data
);


//V4.2 : Access token and refresh_token

/** @type {string | undefined} */
let access_token_v42 = undefined;
app.use("/api/v4.2/login", async function (req, res) {
  const respond = await fetch("http://localhost:3032/api/v4.2/auth", {
    method: "post",
    body: Buffer.from(JSON.stringify(login_body_Client)),
    headers: { "Content-Type": "application/json" },
  });
  const data = await respond.json();
  if (data.access_token) {
    access_token_v42 = data.access_token;
    return res.status(200).json({ access_token: access_token_v42 });
  } else {
    return res.status(respond.status).json(data);
  }
});

app.use(
  "/api/v4.2/film",
  async function (req, res, next) {
    const tokenParts = access_token_v42.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTimestamp) {
      const newRespond = await fetch("http://localhost:3032/api/v4.2/refresh", {
        method: "post",
        body: Buffer.from(JSON.stringify(login_body_Client)),
        headers: { "Content-Type": "application/json" },
      });
      const newData = await newRespond.json();

      if (newData.access_token) {
        access_token_v42 = newData.access_token;
      } else {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    }
    res.locals.token = "Bearer " + (access_token_v42 || "");
  return next();
  },
  fetch_films_from_server_B,
  forward_server_B_data
);

