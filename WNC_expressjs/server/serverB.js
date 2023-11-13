import express from "express";
import films_router from "../src/routes/api/films.js";
import { validateToken } from "../src/middlewares/validateToken.js";
import login_router, { generateAccessToken } from "../src/routes/login.js";
import "dotenv/config";
import { serve } from "swagger-ui-express";
import crypto from "crypto"

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

app.listen(PORT, function () {
  console.log(`Server B at http://localhost:${PORT}`);
});
``;
