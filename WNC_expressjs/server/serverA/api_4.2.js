import { Router } from "express";
import { validateLogin } from "../../src/middlewares/validateLogin.js";
import { validateToken } from "../../src/middlewares/validateToken.js";
import knex from "knex";
import { z } from "zod";
import jwt from "jsonwebtoken";
import films_router from "../../src/routes/api/films.js";
const api_router = Router();

api_router.post("/refresh", async function (req, res) {
  const token = req.body["refresh_token"];
  if (!token) {
    return res.status(401).json({ error: "Missing JWT token" });
  }
  try {
    jwt.verify(token, process.env.SECRETE_KEY);
  } catch (e) {
    if (e.name !== "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid JWT" });
    } else {
      return res.status(401).json({ error: "Refresh token expired" });
    }
  }

  const user_data = z
    .object({
      id: z.number(),
      user_name: z.string(),
    })
    .safeParse(
      await knex("user_refresh_token")
        .where({ refresh_token: token })
        .join("user", "user_refresh_token.user_id", "=", "user.id")
        .first()
    );
  if (!user_data.success) {
    return res.status(401).json({ error: "Refresh token doesn't exist" });
  }

  const access_token = jwt.sign(
    { user_name: user_data.data.user_name },
    process.env.SECRETE_KEY,
    {
      expiresIn: "120s",
    }
  );
  return res.status(200).json({
    access_token: access_token,
    exp: 120 * 1000,
  });
});

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
    // const [id] = await knex("user_refresh_token").insert({
    //   refresh_token: refresh_token,
    //   user_id: res.locals.user_data.id,
    // });
    const id = 1;
    if (id) {
      return res
        .status(200)
        .json({ access_token: token, refresh_token: refresh_token });
    } else {
      return res
        .status(500)
        .json({ error: "Server can't create refresh token" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Server can't create refresh token" });
  }
});

api_router.use("/film", validateToken, films_router);

export { api_router as api_router_v4_2 };
