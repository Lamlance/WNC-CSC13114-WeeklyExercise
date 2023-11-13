import express from "express";
import { z } from "zod";
import { validation_mw_builder_body } from "../utils/ValidationMiddlewareBuilder.js";
import { createHash, createHmac } from "crypto";
import {
  validateToken,
  validate_jwt_wo_lib_mw,
} from "../middlewares/validateToken.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import jwt from "jsonwebtoken";
import { FindUserByUsername, CreateUser } from "../db/user.js";

const login_router = express.Router();

const UserSchema = z.object({
  user_name: z.string(),
  pwd: z.string(),
});

/**
 * @param {object} header
 * @param {object} payload
 */
function create_acess_token(header, payload) {
  const curr_time = new Date().getTime();
  payload["iat"] = curr_time / 1000;
  //payload["exp"] = (curr_time + 86400000) / 1000; // 1 day;
  payload["exp"] = (curr_time + 3600000) / 1000; // 1 hour;

  const header_and_payload =
    Buffer.from(JSON.stringify(header), "utf-8").toString("base64url") +
    "." +
    Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const access_signature = createHmac("sha256", process.env.SECRETE_KEY)
    .update(header_and_payload)
    .digest("base64url");
  return header_and_payload + "." + access_signature;
}

/**
 * @param {object} payload
 */
function generateAccessToken(payload) {
  // authenticate username & password

  const accessToken = jwt.sign(
    payload,
    process.env.SECRETE_KEY || "mock_secrete_key",
    { expiresIn: "1h" }
  );

  return accessToken;
}

login_router.use("/ui", express.static("./src/site"));
login_router.get("/ui", function (req, res) {
  return res.redirect("/auth/ui/login.html");
});

login_router.post(
  "/register",
  validation_mw_builder_body(UserSchema),
  async function (req, res, next) {
    const { user_name, pwd } = res.locals.body;
    const existingUser = await FindUserByUsername(user_name);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = createHash("sha256").update(pwd).digest("base64url");

    const newUserCreated = CreateUser({
      user_name: user_name,
      pwd: hashedPassword,
    });

    if (newUserCreated) {
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(500).json({ error: "Failed to register user" });
    }
  }
);

login_router.post(
  "/lib/login",
  validation_mw_builder_body(UserSchema),
  validateLogin,
  function (req, res, next) {
    /** @type {{user_name:string,pwd:string}} */
    const { user_name, pwd } = res.locals.body;

    const pay_load = {
      user_id: 1,
    };
    const access_token = generateAccessToken({
      user_id: pay_load.user_id,
    });
    return res.status(200).json({
      access_token: access_token,
    });
  }
);

login_router.use("/lib/auth", validateToken, function (req, res) {
  return res.status(200).json({ verified: true });
});

login_router.post(
  "/nolib/login",
  validation_mw_builder_body(UserSchema),
  validateLogin,
  function (req, res, next) {
    /** @type {{user_name:string,pwd:string}} */
    const { user_name, pwd } = res.locals.body;
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const pay_load = {
      user_id: 1,
    };
    const access_token = create_acess_token(header, pay_load);
    return res.status(200).json({
      access_token: access_token,
    });
  }
);

login_router.use("/nolib/auth", validate_jwt_wo_lib_mw, function (req, res) {
  return res.status(200).json({ verified: true });
});

export default login_router;
export { generateAccessToken, create_acess_token };
