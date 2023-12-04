import { Router } from "express";
import {
  AddTaskToUser,
  DeleteTask,
  GetUserList,
  ToDoSchema,
  UpdateComplete,
} from "./ToDoList.js";
import { boolean, z } from "zod";
const ToDoRouter = Router();

ToDoRouter.get("/", async function (req, res) {
  const { user_id } = res.locals.token_payload;
  if (!user_id || Number.isNaN(user_id))
    return res.status(403).json({ error: "Invalid user id" });

  const taskList = await GetUserList(Number(user_id));
  return res.status(200).json({ data: taskList });
});

ToDoRouter.post("/", async function (req, res) {
  const { user_id } = res.locals.token_payload;
  if (!user_id || Number.isNaN(user_id))
    return res.status(403).json({ error: "Invalid user id" });

  const body = ToDoSchema.safeParse(req.body);
  if (body.success == false) return res.status(400).json({ error: body.error });

  const success = await AddTaskToUser(user_id, body.data);
  if (success === true) return res.status(200).json({ data: body.data });
  else return res.status(500).json({ error: success });
});

ToDoRouter.delete("/:task_id", async function (req, res) {
  const { user_id } = res.locals.token_payload;
  if (!user_id || Number.isNaN(user_id))
    return res.status(403).json({ error: "Invalid user id" });

  const success = await DeleteTask(user_id, req.params.task_id);
  if (success === true)
    return res
      .status(200)
      .json({ message: `Delete task ${req.params.task_id}` });
  else return res.status(500).json({ error: success });
});
ToDoRouter.patch("/:task_id", async function (req, res) {
  const { user_id } = res.locals.token_payload;
  if (!user_id || Number.isNaN(user_id))
    return res.status(403).json({ error: "Invalid user id" });

  const body = z.boolean().safeParse(req.body.completed);
  if (body.success == false) return res.status(400).json({ error: body.error });

  const success = await UpdateComplete(req.params.task_id, body.data);
  if (success === true)
    return res
      .status(200)
      .json({ completed: body.data, task_id: req.params.task_id });
  else return res.status(500).json({ error: success });
});
export default ToDoRouter;
