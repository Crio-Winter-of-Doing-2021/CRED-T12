const request = require('supertest');
const app = require('../server');


describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app).get("/random")
            .expect(404, done);
    });
});

describe("GET /api/ping", () => {
    it("should return 200", async (done) => {
        request(app).get("/api/ping")
            .expect(200, done);
    });
});