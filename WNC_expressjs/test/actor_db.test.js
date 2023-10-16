import assert from "assert";
import {
  AddActor,
  DeleteAnActor,
  GetActorById,
  GetActors,
  UpdateAnActor,
} from "../src/db/actors.js";

// !!Dont import import { describe } from "node:test" !!;

describe("Actor repos", function () {
  let added_id = 0;
  let actor_object = {};

  describe("Get actors", function () {
    it("Get 5 actors", async function () {
      const actors = await GetActors({ skip: 0, take: 5 });
      assert.equal(actors.length, 5);
      actor_object = actors[0];
    });
  });

  describe("Get an actor detail", function () {
    it("return an actor", async function () {
      const actor = await GetActorById({ id: actor_object.actor_id });
      assert.equal(typeof actor.actor_id, "number");
      assert.equal(typeof actor.first_name, "string");
      assert.equal(typeof actor.last_name, "string");
    });
  });

  describe("Create an actor", function () {
    it("create an actor", async function () {
      actor_object = { ...actor_object, first_name: "Lam", last_name: "Hoang" };
      const created_id = await AddActor(actor_object);
      assert.equal(typeof created_id, "number");
      actor_object.actor_id = created_id;
      const actor = await GetActorById({ id: actor_object.actor_id });

      assert.equal(actor.first_name, actor_object.first_name);
      assert.equal(actor.last_name, actor_object.last_name);
    });
  });

  describe("Update actor", function () {
    it("update first_name only", async function () {
      actor_object.first_name = "Sang";
      await UpdateAnActor({
        id: actor_object.actor_id,
        info: { first_name: actor_object.first_name },
      });
      const actor = await GetActorById({ id: actor_object.actor_id });
      assert.equal(actor.first_name, actor_object.first_name);
      assert.equal(actor.last_name, actor_object.last_name);
    });
    it("update all field", async function () {
      actor_object.first_name = "Trang";
      actor_object.last_name = "Khang";
      await UpdateAnActor({
        id: actor_object.actor_id,
        info: {
          first_name: actor_object.first_name,
          last_name: actor_object.last_name,
        },
      });
      const actor = await GetActorById({ id: actor_object.actor_id });
      assert.equal(actor.first_name, actor_object.first_name);
      assert.equal(actor.last_name, actor_object.last_name);
    });
  });

  describe("Delete actor", function () {
    it("delete actor", async function () {
      await DeleteAnActor({ id: actor_object.actor_id });
      const actor = await GetActorById({ id: actor_object.actor_id });
      assert.equal(actor.msg, `Actor ${actor_object.actor_id} not found`);
    });
  });
});
