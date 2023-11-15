import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fetch from "node-fetch";
import { MysqlClient } from "../src/db/connect.js";

/**
 * @typedef {(req:import("express").Request,res:import("express").Response,next:import("express").NextFunction)=>any} express_middleware
 */

/** @type {express_middleware} */
async function create_secrete_key(req, res, next) {
  const payload = {
    iat: Math.floor(new Date().getTime() / 1000),
    url: req.originalUrl,
  };
  const payload64 = Buffer.from(JSON.stringify(payload), "utf-8").toString(
    "base64url"
  );
  const signature = crypto
    .createHmac("sha256", process.env.SECRETE_KEY)
    .update(payload64)
    .digest("base64url");
  const secretkey = payload64 + "." + signature;
  res.locals.token = "Key " + (secretkey || "");

  return next();
}

/** @type {express_middleware} */
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

/** @type {express_middleware} */
async function forward_server_B_data(req, res) {
  /** @type {{serverB: Response | undefined}} */
  const { serverB } = res.locals;

  if (serverB) {
    return res.status(serverB.status).json(await serverB.json());
  } else {
    return res.status(500).json({ error: "Server error" });
  }
}

/** @type {express_middleware} */

function refresh_access_token(req, res, next) {
  if (res.locals.access_token_expired === false) {
    return next();
  }

  const user_data = res.locals.user_data;
  res.locals.access_token = jwt.sign(
    { user_name: user_data.user_name },
    process.env.SECRETE_KEY,
    { expiresIn: "120s" }
  );
  return next();
}

/** @type {express_middleware} */
async function check_refresh_token(req, res, next) {
  const refreshToken =
    req.body["refresh_token"] || req.headers["refresh_token"];
  if (!refreshToken) {
    return res.status(401).json({ error: "Missing refresh token" });
  }

  try {
    jwt.verify(refreshToken, process.env.SECRETE_KEY);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Refresh token expired" });
    } else {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  }

  const user_data = await MysqlClient("user_refresh_token")
    .where("user_refresh_token.refresh_token", "=", refreshToken)
    .join("user", "user_refresh_token.user_id", "=", "user.id")
    .first();

  if (!user_data) {
    return res.status(401).json({ error: "Refresh token doesn't exist" });
  }
  res.locals.user_data = user_data;
  return next();
}

/** @type {express_middleware} */
function check_access_token(req, res, next) {
  const auth_header = req.headers["authorization"];

  const access_token = auth_header && auth_header.split(" ")[1];
  if (!access_token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  jwt.verify(access_token, process.env.SECRETE_KEY, function (err, decoded) {
    const payload = JSON.parse(
      Buffer.from(access_token.split(".")[1], "base64url")
    );
    if (
      (err && err.name === "TokenExpiredError") ||
      (payload.exp && payload.exp < new Date().getTime() / 1000)
    ) {
      res.locals.access_token = "";
      res.locals.access_token_expired = true;
    } else {
      res.locals.access_token = access_token;
      res.locals.access_token_expired = false;
    }
    next();
  });
}

export {
  create_secrete_key,
  fetch_films_from_server_B,
  forward_server_B_data,
  check_access_token,
  check_refresh_token,
  refresh_access_token,
};
