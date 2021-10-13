const request = require('supertest');
const app = require('../src/server');
const db = require('../src/models');

const {setupTest} = require('./_beforeTest');

beforeAll(async () => {
    setupTest()
    try {
        await db.sequelize.sync({force: true})
    } catch (error) {
        console.error(error)
    }
})

afterAll(async () => {
    await db.sequelize.drop()
    await db.sequelize.close()
})

test('handle errors for invalid path', async () => {
    const res = await request(app).get("/")
    expect(res.status).toBe(404)
})

