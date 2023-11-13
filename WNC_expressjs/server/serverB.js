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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function check_login(req, res, next) {
  const { user_name, pwd } = req.body;
  if (user_name === admin_name && pwd === admin_pwd) {
    return next();
  }
  return res.status(401).json({ error: "Invalid user name or password" });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function check_login_client(req, res, next) {
  const { user_name, pwd } = req.body;

  const server_name = await MysqlClient.from("user")
    .select("user_name")
    .where("user_name", user_name)
    .first();

  const server_pwd = await MysqlClient.from("user")
    .select("pwd")
    .where("user_name", server_name.user_name)
    .first();

  if (user_name === server_name.user_name && pwd === server_pwd.pwd) {
    return next();
  }
  return res.status(401).json({ error: "Invalid user name or password" });
}


app.use(express.json());

//V1: Ko co authorization
app.use("/api/v1/film", films_router);

//V2: Access token only
app.use("/api/v2/auth", check_login, function (req, res) {
  return res.status(200).json({
    access_token: generateAccessToken({ user_name: req.body.user_name }),
  });
});
app.use("/api/v2/film", validateToken, films_router);

//V3 Secret key
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function check_secretkey(req, res, next) {
  // const { user_name, pwd } = req.body;
  // if (user_name === admin_name && pwd === admin_pwd) {
  //   return next();
  // }
  // return res.status(401).json({ error: "Wrong " });

  const authHeader = req.headers["authorization"];
  const secretkey = authHeader && authHeader.split(" ")[1];

  console.log('sever b')
  console.log(secretkey)
  if (!secretkey) {
    return res.status(401).json({ message: "Access denied" });
  }
  const [ payload64, signature ] = secretkey.split(".")
  const payload = JSON.parse(Buffer.from(payload64, "base64url"));
  if (Math.floor((new Date().getTime()) / 1000) > (payload["iat"] + 120) * 1000 ) {
    return res.status(401).json({ error: "Token expired" });
  }
  if (signature != crypto.createHmac("sha256", process.env.SECRETE_KEY).update(payload64).digest("base64url")) {

    return res.status(401).json({ error: "Invalid signature" });
  }
  next();
}
app.use("/api/v3/film", check_secretkey, films_router);

//V4 Access token & refresh token

/**
 * @param {object} payload
 */
function generateNewAccessToken(payload) {
  const accessToken = jwt.sign(
    payload,
    process.env.SECRETE_KEY || "mock_secrete_key",
    { expiresIn: "120s" }
  );

  return accessToken;
}

/**
 * @param {object} payload
 */
function generateNewRefreshToken(payload) {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "15d",
  });

  return refreshToken;
}

app.use("/api/v4.2/auth", check_login_client, async function (req, res) {
  const access_token = generateNewAccessToken({
    user_name: req.body.user_name,
  });

  const refresh_token = generateNewRefreshToken({
    user_name: req.body.user_name,
  });

  const user_id = await MysqlClient.from("user")
    .select("user_id")
    .where("user_name", req.body.user_name)
    .first();

  const user_refresh_token_id = await MysqlClient.from("user_refresh_token")
    .select("user_id")
    .where("user_id", user_id.user_id)
    .first();

  if (user_refresh_token_id) {
    await MysqlClient.from("user_refresh_token")
      .where("user_id", user_id.user_id)
      .update({ refresh_token });
  } else {
    await MysqlClient.from("user_refresh_token").insert({
      user_id: user_id.user_id,
      refresh_token: refresh_token,
    });
  }
  return res.status(200).json({
    access_token: access_token,
    refresh_token: refresh_token,
  });
});

app.use("/api/v4.2/refresh", async function (req, res) {
  const user_id = await MysqlClient.from("user")
    .select("user_id")
    .where("user_name", req.body.user_name)
    .first();

  const refreshToken = await MysqlClient.from("user_refresh_token")
    .select("refresh_token")
    .where("user_id", user_id.user_id)
    .first();

  jwt.verify(
    refreshToken.refresh_token,
    process.env.REFRESH_TOKEN,
    (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Refresh Token expired" });
        }

        return res.status(401).json({ message: "Invalid JWT" });
      } else {
        const accessToken = generateNewAccessToken({
          user_name: req.body.user_name,
        });

        return res.json({ access_token: accessToken });
      }
    }
  );
});

app.use("/api/v4.2/film", validateToken, films_router);

app.listen(PORT, function () {
  console.log(`Server B at http://localhost:${PORT}`);
});

app.listen(PORT, function () {
  console.log(`Server B at http://localhost:${PORT}`);
});


