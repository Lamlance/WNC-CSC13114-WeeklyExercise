import jwt from "jsonwebtoken";
import { createHmac } from "crypto";
const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

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
  if (curr_time > payload_body.exp * 1000) {
    return res.status(401).json({ error: "Token expired" });
  }
  return next();
}
export { validateToken, validate_jwt_wo_lib_mw };
