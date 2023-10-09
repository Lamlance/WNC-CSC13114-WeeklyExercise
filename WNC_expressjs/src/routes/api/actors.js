import express, { query } from "express";
import { GetActors, GetActorById } from "../../db/actors.js";
import { CallAndCatchAsync } from "../../utils/utils.js";
import { date, z } from "zod";

const actors_router = express.Router();
const ActorGetSchema = z.object({
  take: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
});

const ActorGetByIdSchema = z.object({
  id: z.coerce.number(),
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
    req.queryparams
  );

  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [data, err] = await CallAndCatchAsync(GetActors, queries);

  if (err != null) {
    return res.status(500).json({ error: "Something happend :))" });
  }
  params;

  return res.status(200).json({ data: data });
});

actors_router.post("/");

actors_router.get("/:id", async function (req, res) {
  const { id } = ActorGetByIdSchema.parse(req.params);

  if (!id) {
    return res.status(400).json({ error: "Missing required parameter!" });
  }

  const [data, err] = await CallAndCatchAsync(GetActorById, id);

  if (err != null) {
    return res.status(500).json({ error: "Something went wrong!" }, err);
  }

  if (!data) {
    return res.status(404).json({ error: "Actor not found!" });
  }

  return res.status(200).json({ data: data });
});
actors_router.put("/:id");
actors_router.delete("/:id");

export default actors_router;
