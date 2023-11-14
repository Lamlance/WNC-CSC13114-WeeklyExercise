import { MysqlClient } from "../db/connect.js";

async function CreateNewRefreshToken(userId, refresh_token) {
  try {
    const token = await MysqlClient.from("user_refresh_token")
      .where({ user_id: userId })
      .first();
    console.log(token);
    if (token) {
      return MysqlClient.from("user_refresh_token")
        .where({ user_id: userId })
        .update({ refresh_token });
    } else {
      return MysqlClient.from("user_refresh_token").insert({
        user_id: userId,
        refresh_token,
      });
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function FindUserRefreshToken(userId) {
  try {
    const token = await MysqlClient.from("user_refresh_token")
      .where({ user_id: userId })
      .first();

    return token;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export { CreateNewRefreshToken, FindUserRefreshToken };
