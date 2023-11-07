import express from "express";
import { z } from "zod";
import { validation_mw_builder_body } from "../utils/ValidationMiddlewareBuilder.js";
import { createHash, createHmac } from "crypto";
import { validateToken } from "../middlewares/validateToken.js";
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
  payload["iat"] = curr_time;
  payload["exp"] = curr_time + 86400000; // 1 day;

  const header_and_payload =
    Buffer.from(JSON.stringify(header), "utf-8").toString("base64url") +
    "." +
    Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const access_signature = createHmac("sha256", process.env.SECRETE_KEY)
    .update(header_and_payload)
    .digest("base64url");
  return header_and_payload + "." + access_signature;
}

login_router.post(
  "/login",
  validation_mw_builder_body(UserSchema),
  validateLogin,
  function (req, res, next) {
    /** @type {{user_name:string,pwd:string}} */
    const { user_name, pwd } = res.locals.body;
    const header = {
      algo: "HS256",
      typ: "JWT",
    };
    const pay_load = {
      user_id: 1,
    };
    const access_token = create_acess_token(header, pay_load);
    console.log(access_token);
    return res.status(200).json({
      access_token: access_token,
    });
  }
);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function validate_jwt_wo_lib_mw(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [header, payload, signature] = token.split(".");
  const decode = createHmac("sha256", process.env.SECRETE_KEY)
    .update(header + "." + payload)
    .digest("base64url");
  if (decode !== signature) {
    return res.status(401).json({ error: "Invalid JWT" });
  }

  const payload_body = JSON.parse(Buffer.from(payload, "base64url"));
  const curr_time = new Date().getTime();
  if (curr_time > payload_body.exp) {
    return res.status(401).json({ error: "Token expired" });
  }
  return next();
}

login_router.use("/ui", express.static("./src/site"));
login_router.get("/ui", function (req, res) {
  return res.redirect("/auth/ui/login.html");
});

// json web token
const generateAccessToken = (payload) => {
  // authenticate username & password

  const accessToken = jwt.sign(
    {
      ...payload,
    },
    process.env.SECRETE_KEY,
    { expiresIn: "1h" }
  );

  return accessToken;
};

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

login_router.use("/lib", validateToken, function (req, res) {
  return res.status(200).json({ verified: true });
});

login_router.use("/", validate_jwt_wo_lib_mw, function (req, res) {
  return res.status(200).json({ verified: true });
});

export default login_router;
export { validate_jwt_wo_lib_mw };
