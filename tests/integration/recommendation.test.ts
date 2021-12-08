import supertest from "supertest";
import app from "../../src/app";
import connection from "../../src/database";
import { cleanDatabase, endConnection } from "../utils/database";
import { createRecommendation } from "../factories/recommendationFactory";

beforeEach(cleanDatabase);

afterAll(async () => {
  await cleanDatabase();
  await endConnection();
});

describe("POST /recommendation", () => {
  it("saves the recommendation and returns 201 for valid params", async () => {
    const body = {
      name: "Test Music 1",
      youtubeLink: "http://www.youtube.com/watch?v=9bZkp7q19f0",
    };

    const beforeInsert = await connection.query(
      `SELECT * FROM recommendations`
    );
    const response = await supertest(app).post("/recommendation").send(body);
    const afterInsert = await connection.query(`SELECT * FROM recommendations`);

    expect(response.status).toBe(201);
    expect(beforeInsert.rows.length).toBe(0);
    expect(afterInsert.rows.length).toBe(1);
  });

  it("returns 400 for invalid params", async () => {
    const body = {};

    const response = await supertest(app).post("/recommendation").send(body);

    expect(response.status).toBe(400);
  });

  it("returns 422 for invalid youtube link", async () => {
    const body = {
      name: "Test Music 1",
      youtubeLink: "http://www.youtubiu.com/watch?v=9bZkp7q19f0",
    };

    const response = await supertest(app).post("/recommendation").send(body);

    expect(response.status).toBe(422);
  });
});

describe("POST /recommendation/:id/upvote", () => {
  it("returns 404 for inexistent recommendation", async () => {
    const response = await supertest(app)
      .post("/recommendations/1/upvote")
      .send({});

    expect(response.status).toBe(404);
  });

  it("upvotes an existent recommendation", async () => {
    const recommendation = await createRecommendation(0);
    const id = recommendation.rows[0].id;

    await supertest(app).post(`/recommendations/${id}/upvote`).send();

    const upvotedRecommendation = await connection.query(
      `SELECT * FROM recommendations WHERE id = $1`,
      [id]
    );

    expect(upvotedRecommendation.rows[0].score).toBe(1);
  });
});
