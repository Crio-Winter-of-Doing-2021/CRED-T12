const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');
const testConf = require('./tesctConfig');
const { startDB, stopDB } = require('../dbConnection');
const User = require('../src/models/user');
const Card = require('../src/models/card');
const { Transaction } = require('../src/models/Transaction');
const { Payment } = require('../src/models/Payment');

let tokenResp;
let cardResp;
let transactionResp;

beforeAll(async (done) => {
    await startDB();

    tokenResp = await request(app)
        .post("/api/user/sign-up")
        .send(testConf.userBody);

    cardResp = await request(app)
        .post("/api/card/add")
        .send(testConf.cardBody)
        .set("Authorization", `Bearer ${tokenResp.body.data.token}`);

    transactionResp = await request(app)
        .post(`/api/transactions/add/${cardResp.body.data.id}`)
        .send(testConf.transactionBody)
        .set("Authorization", `Bearer ${tokenResp.body.data.token}`);

    done();
});


describe("POST /api/transactions/add/:cardId", () => {
    it("should return 200", async (done) => {
        await expect(transactionResp.status).to.be.equal(200);
        await expect(transactionResp.body.success).to.be.equal("success");
        done();
    });
});

describe(`GET /api/transactions/analytics/:cardId`, () => {
    it("should return 200 and success", async (done) => {
        let resp = await request(app)
            .get(`/api/transactions/analytics/${cardResp.body.data.id}`)
            .set("Authorization", `Bearer ${tokenResp.body.data.token}`);
        await expect(resp.status).to.be.equal(200);
        await expect(resp.body.success).to.be.equal("success");
        done();
    });
});

describe(`POST /api/card/pay/:cardId`, () => {
    it("should return 200 and success", async (done) => {
        const amount = transactionResp.body.data[0].amount;
        console.log("amount : ", amount);
        let resp = await request(app)
            .post(`/api/card/pay/${cardResp.body.data.id}`)
            .send({
                amount: amount
            })
            .set("Authorization", `Bearer ${tokenResp.body.data.token}`);
        await expect(resp.status).to.be.equal(200);
        await expect(resp.body.success).to.be.equal("success");
        done();
    });
});

afterAll(async (done) => {
    await Payment.deleteMany({});
    await Transaction.deleteMany({});
    await Card.deleteMany({});
    await User.deleteMany({});
    await stopDB();
    done();
});
