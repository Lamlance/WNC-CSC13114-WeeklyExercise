import { MysqlClient } from "../db/connect.js";
import jwt from "jsonwebtoken";

async function CreateNewRefreshToken(userId, refresh_token) {
  try {
    const token = await MysqlClient.from("user_refresh_token")
      .where({ id: userId })
      .first();
    if (token) {
      return MysqlClient.from("user_refresh_token")
        .where({ id: userId })
        .update({ refresh_token });
    } else {
      return MysqlClient.from("user_refresh_token").insert({
        user_id: userId,
        refresh_token,
      });
    }
  } catch (error) {
    return null;
  }
}

export { CreateNewRefreshToken };
