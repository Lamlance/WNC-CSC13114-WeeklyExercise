import express from "express";
import { DeleteAnActor, GetActors } from "../../db/actors.js";
import { CallAndCatchAsync } from "../../utils/utils.js";
import { z } from "zod";

const actors_router = express.Router();
const ActorGetSchema = z.object({
  take: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
});

const ActorPatchSchema = z
  .object({
    last_name: z.string().optional(),
    first_name: z.string().optional(),
  })
  .partial()
  .refine(
    function ({ last_name, first_name }) {
      return !!last_name || !!first_name;
    },
    { message: "At least 1 value" }
  );

actors_router.get("/", async function (req, res) {
  const [queries, q_err] = await CallAndCatchAsync(
    ActorGetSchema.parseAsync,
    req.query
  );

  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [data, err] = await CallAndCatchAsync(GetActors, queries);

  if (err != null) {
    return res.status(500).json({ error: "Something happend :))" });
  }

  return res.status(200).json({ data: data });
});

actors_router.post("/");

actors_router.get("/:id", async function (req, res) {
  const { id } = req.params;
  return res.status(200).json({ Hello: id });
});
actors_router.put("/:id");
actors_router.delete("/:id", async function (req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing id!" });
  }

  const [data, err] = await CallAndCatchAsync(DeleteAnActor, { id });

  if (err) {
    return res.status(500).json({ msg: "Server error!", error: err });
  }

  return res.status(200).json(data);
});

export default actors_router;
