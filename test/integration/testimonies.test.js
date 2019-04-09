const request = require("supertest");
const { Testimony } = require("../../models/testimony");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/testimonies", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Testimony.remove({});
  });

  describe("GET /", () => {
    it("should return all testimonies", async () => {
      const testimonies = [{ name: "testimony1" }, { name: "testimony2" }];

      await Testimony.collection.insertMany(testimonies);

      const res = await request(server).get("/api/testimonies");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "testimony1")).toBeTruthy();
      expect(res.body.some(g => g.name === "testimony2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a testimony if valid id is passed", async () => {
      const testimony = new Testimony({ name: "testimony1" });
      await testimony.save();

      const res = await request(server).get(
        "/api/testimonies/" + testimony._id
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", testimony.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/testimonies/1");

      expect(res.status).toBe(404);
    });

    it("should return 404 if no testimony with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/testimonies/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/testimonies")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "testimony1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if testimony is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if testimony is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the testimony if it is valid", async () => {
      await exec();

      const testimony = await Testimony.find({ name: "testimony1" });

      expect(testimony).not.toBeNull();
    });

    it("should return the testimony if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "testimony1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let newName;
    let testimony;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/testimonies/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      testimony = new Testimony({ name: "testimony1" });
      await testimony.save();

      token = new User().generateAuthToken();
      id = testimony._id;
      newName = "updatedName";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if testimony is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if testimony is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if testimony with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the testimony if input is valid", async () => {
      await exec();

      const updatedTestimony = await Testimony.findById(testimony._id);

      expect(updatedTestimony.name).toBe(newName);
    });

    it("should return the updated testimony if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let testimony;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/testimonies/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      testimony = new Testimony({ name: "testimony1" });
      await testimony.save();

      id = testimony._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no testimony with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the testimony if input is valid", async () => {
      await exec();

      const testimonyInDb = await Testimony.findById(id);

      expect(testimonyInDb).toBeNull();
    });

    it("should return the removed testimony", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", testimony._id.toHexString());
      expect(res.body).toHaveProperty("name", testimony.name);
    });
  });
});
