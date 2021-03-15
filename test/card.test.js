const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');
const testConf = require('./tesctConfig');
const { startDB, stopDB } = require('../dbConnection');
const User = require('../src/models/user');
const Card = require('../src/models/card');
let tokenResp;
let cardResp;

beforeAll(async (done) => {
    await startDB();
    tokenResp = await request(app)
        .post("/api/user/sign-up")
        .send(testConf.userBody);

    cardResp = await request(app)
        .post("/api/card/add")
        .send(testConf.cardBody)
        .set("Authorization", `Bearer ${tokenResp.body.data.token}`);
    done();
});

describe("POST /api/card/add", () => {
    it("should return 200", async (done) => {
        console.log(cardResp.body.data.id)
        await expect(cardResp.status).to.be.equal(200);
        await expect(cardResp.body.success).to.be.equal("success");
        done();
    });
});

describe("GET /api/card/all", () => {
    it("should return 200 and success", async (done) => {
        let allResp = await request(app)
            .get("/api/card/all")
            .set("Authorization", `Bearer ${tokenResp.body.data.token}`);
        await expect(allResp.status).to.be.equal(200);
        await expect(allResp.body.success).to.be.equal("success");
        done();
    });
});

describe(`GET /api/card/single/cardId`, () => {
    it("should return 200 and success", async (done) => {
        let resp = await request(app)
            .get(`/api/card/single/${cardResp.body.data.id}`)
            .set("Authorization", `Bearer ${tokenResp.body.data.token}`);
        await expect(resp.status).to.be.equal(200);
        await expect(resp.body.success).to.be.equal("success");
        done();
    });
});

describe(`GET /api/card/history/:cardId`, () => {
    it("should return 200 and success", async (done) => {
        let resp = await request(app)
            .get(`/api/card/history/${cardResp.body.data.id}`)
            .set("Authorization", `Bearer ${tokenResp.body.data.token}`);
        await expect(resp.status).to.be.equal(200);
        await expect(resp.body.success).to.be.equal("success");
        done();
    });
});


afterAll(async (done) => {
    await Card.deleteMany({});
    await User.deleteMany({});
    await stopDB();
    done();
});
