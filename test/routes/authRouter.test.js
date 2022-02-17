const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");

describe("/token-elimination", () => {
  it("should respond with 200", async () => {
    const response = await request(app).post("/auth/token-elimination");

    expect(response.status).to.equal(200);
  });

  it("should respond with set-cookie header", async () => {
    const response = await request(app).post("/auth/token-elimination");

    expect(response.header).to.have.own.property("set-cookie");
  });
});
