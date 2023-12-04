import knex from "knex";
import { z } from "zod";

const ToDoSchema = z.object({
  task_id: z.string(),
  taskName: z.string(),
  completed: z.coerce.boolean(),
});
const MySQLCon = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3666,
    user: "root",
    password: "msql",
    database: "actor",
  },
});
/**
 * @param {number} uid
 */
async function GetUserList(uid) {
  const data = await MySQLCon("user_todo")
    .join("user_todo_list", "user_todo.task_id", "=", "user_todo_list.task_id")
    .where("user_todo_list.user_id", "=", uid)
    .select("user_todo.*");
  const tasks = z.array(ToDoSchema).safeParse(data);
  if (tasks.success) return tasks.data.map((t) => ({ ...t, id: t.task_id }));
  else return [];
}

/**
 * @param {number} uid
 * @param {z.infer<ToDoSchema>} taskData
 */
async function AddTaskToUser(uid, taskData) {
  try {
    await MySQLCon("user_todo").insert({
      task_id: taskData.task_id,
      taskName: taskData.taskName,
      completed: taskData.completed,
    });
    await MySQLCon("user_todo_list").insert({
      user_id: uid,
      task_id: taskData.task_id,
    });
    return true;
  } catch (e) {
    return e;
  }
}

/**
 * @param {number} uid
 * @param {string} task_id
 */
async function DeleteTask(uid, task_id) {
  try {
    await MySQLCon("user_todo_list")
      .where((builder) => builder.where("task_id", "=", task_id))
      .del();
    await MySQLCon("user_todo").where("task_id", task_id).del();
    return true;
  } catch (e) {
    console.warn(e);
    return e;
  }
}

/**
 * @param {string} task_id
 * @param {boolean} complete
 */
async function UpdateComplete(task_id, complete) {
  try {
    await MySQLCon("user_todo").where("task_id", task_id).update({
      completed: complete,
    });
    return true;
  } catch (e) {
    return e;
  }
}

export { GetUserList, AddTaskToUser, DeleteTask, UpdateComplete, ToDoSchema };
