import { MysqlClient } from "../db/connect.js";

async function FindUserByUsername(username) {
  try {
    const user = await MysqlClient.from("user")
      .where({ user_name: username })
      .first();
    return user;
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
}

async function FindUserById(userId) {
  try {
    const user = await MysqlClient.from("user")
      .where({ user_id: userId })
      .first();
    return user;
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
}

async function FindUser(userName, hashedPassword) {
  try {
    const user = await MysqlClient.from("user")
    .where({ user_name: userName, pwd: hashedPassword })
    .first();
    return user;
  } catch (err) {
    console.error("Error finding user: ", error);
    return null;
  }
}

async function CreateUser({ user_name, pwd }) {
  try {
    const insertedUserId = await MysqlClient("user").insert({
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

export { FindUserByUsername, FindUserById, FindUser, CreateUser };
