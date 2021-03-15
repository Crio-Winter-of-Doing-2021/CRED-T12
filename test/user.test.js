const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');
const testConf = require('./tesctConfig');
const {startDB, stopDB} = require('../dbConnection');
const User = require('../src/models/user');
let token;
let tokenBody;
let signupStatus;

beforeAll(async (done) => {
    await startDB();

    tokenBody = await request(app)
        .post("/api/user/sign-up")
        .send(testConf.userBody);
    token = tokenBody.body.data.token;
    signupStatus = tokenBody.status;
    done();
})
describe("POST /api/user/sign-up", () => {
    it("should return 200 and success", () => {
        expect(signupStatus).to.be.equal(200);
        expect(tokenBody.body.success).to.be.equal("success");
    });
});

describe("POST /api/user/login", () => {
    it("should return 200 and success", async (done) => {
        let loginResp = await request(app)
            .post("/api/user/login")
            .send(testConf.loginBody);
        await expect(loginResp.status).to.be.equal(200);
        await expect(loginResp.body.success).to.be.equal("success");
        done();
    });
});

describe("GET /api/user/auth", () => {
    it("should return 200 and success", async (done) => {
        let authResp = await request(app)
            .get("/api/user/auth")
            .set("Authorization", `Bearer ${token}`)
        await expect(authResp.status).to.be.equal(200);
        await expect(authResp.body.success).to.be.equal("success");
        done();
    });
});

afterAll(async(done)=>{
    await User.deleteMany({})
    await stopDB();
    done();
});
