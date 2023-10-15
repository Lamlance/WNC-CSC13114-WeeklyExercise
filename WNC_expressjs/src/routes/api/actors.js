import express from "express";
import {
  AddActor,
  GetActors,
  GetActorById,
  UpdateAnActor,
  DeleteAnActor,
} from "../../db/actors.js";
import { CallAndCatchAsync } from "../../utils/utils.js";
import { date, z } from "zod";
const actors_router = express.Router();

// Schema
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

const ActorPutSchema = z.object({
  last_name: z.string().optional(),
  first_name: z.string().optional(),
});

const ActorCreateSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
});

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

actors_router.post("/", async function (req, res) {
  let actor = req.body;

  const [validatedData, validationError] = await CallAndCatchAsync(
    ActorCreateSchema.parseAsync,
    actor
  );

  if (validationError) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [response, error] = await CallAndCatchAsync(AddActor, validatedData);

  actor = {
    actor_id: response,
    ...actor,
  };
  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }

  return res.status(200).json(actor);
});

actors_router.get("/:id", async function (req, res) {
  const { id } = ActorGetByIdSchema.parse(req.params);

  if (!id) {
    return res.status(400).json({ error: "Missing required parameter!" });
  }

  const [data, err] = await CallAndCatchAsync(GetActorById, { id });

  if (err != null) {
    return res.status(500).json({ error: "Something went wrong!" }, err);
  }

  if (!data) {
    return res.status(404).json({ error: "Actor not found!" });
  }

  return res.status(200).json({ data: data });
});

actors_router.put("/:id", async function (req, res) {
  const { id } = req.params;
  const [info, q_err] = await CallAndCatchAsync(
    ActorPutSchema.parseAsync,
    req.body
  );
  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing id!" });
  }

  const [data, err] = await CallAndCatchAsync(UpdateAnActor, { id, info });

  if (err) {
    return res.status(500).json({ msg: "Server error!", error: err });
  }

  return res.status(200).json(data);
});

actors_router.patch("/:id", async function (req, res) {
  const { id } = req.params;
  const [info, q_err] = await CallAndCatchAsync(
    ActorPatchSchema.parseAsync,
    req.body
  );
  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing id!" });
  }

  const [data, err] = await CallAndCatchAsync(UpdateAnActor, { id, info });

  if (err) {
    return res.status(500).json({ msg: "Server error!", error: err });
  }

  return res.status(200).json(data);
});

actors_router.delete("/:id", async function (req, res) {
  const { id } = req.params;
  console.log("id", id);

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
export { ActorCreateSchema };
