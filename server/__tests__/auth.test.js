import request from "supertest";
import app from "../index.js";

describe("Auth Endpoints", () => {
  it("should return 404 for root route", async () => {
    await request(app)
      .get("/")  
      .expect(404);
  });

  it("should return 400 for login with no credentials", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({})
      .expect(400);
  });
});
