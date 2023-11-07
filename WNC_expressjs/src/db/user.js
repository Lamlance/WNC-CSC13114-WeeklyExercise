import { MysqlClient } from "../db/connect.js";

async function FindUserByUsername(username) {
  try {
    const user = await MysqlClient.from("users")
      .where({ user_name: username })
      .first();
    return user;
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
}

async function CreateUser({ user_name, pwd }) {
  try {
    const insertedUserId = await MysqlClient("users").insert({
      user_name,
      pwd,
    });

    if (insertedUserId) {
      return insertedUserId;
    } else {
      throw new Error("Failed to add user");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
}

export { FindUserByUsername, CreateUser };
