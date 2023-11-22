import { MysqlClient } from "../db/connect.js";
import { createHash } from "crypto";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
const validateLogin = async (req, res, next) => {
  /** @type {{user_name:string,pwd:string}} */
  const { user_name, pwd } = req.body;
  const hashed_pwd = createHash("sha256").update(pwd).digest("base64url");
  const user = await MysqlClient.from("user")
    .where({ user_name: user_name, pwd: hashed_pwd })
    .first();
  // console.log(req.body)
  // console.log(user)
  if (user) {
    res.locals.user_data = user;
    return next();
  }
  return res.status(401).json({ message: "Invalidate username or password" });
  // return res.status(200).json({ verified: true });
};

export { validateLogin };
