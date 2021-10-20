const request = require('supertest');
const app = require('../../src/server');
const bcrypt = require('bcrypt')
const { createToken, getUserInfo } = require('../../src/helpers/token')
const { correctUser, loggedIn } = require('../../src/middleware/auth')
const db = require('../../src/models');

const { setupTest } = require('../_beforeTest');

jest.mock('../../src/helpers/token', () => ({
    createToken: jest.fn(() => "token"),
    getUserInfo: jest.fn()
}))

jest.mock('../../src/middleware/auth', () => ({
    correctUser: jest.fn((req, res, next) => next()),
    loggedIn: jest.fn((req, res, next) => next())
}))

jest.mock('bcrypt', () => ({
    compare: jest.fn((p1, p2) => p1),
    hash: jest.fn((p, n) => "passwordChange")
}))


describe('testing users routes', () => {

    beforeAll(async () => {
        setupTest()
        try {
            await db.sequelize.sync({ force: true })
        } catch (error) {
            console.error(error)
        }
        db.sequelize.query('ALTER SEQUENCE "user_id_seq" RESTART WITH 1;')
    })

    // beforeEach(async () => {
    //     await db.sequelize.sync({ force: true })
    // })


    afterAll(async () => {
        await db.sequelize.drop()
        await db.sequelize.close()
    })

    test('should create a user', async () => {

        await db.sequelize.sync({ force: true })

        const res = await request(app).post("/api/users/register").send({
            username: "test",
            password: "pass",
            first_name: "Some",
            last_name: "One"
        })
            .expect(200)


    })

    test('should login/logout successfully', async () => {

        const res = await request(app).post("/api/users/login").send({
            username: "test",
            password: "pass"
        })
            // .expect(200)
            // .expect({
            //     message: "Success.",
            //     token: "token"
            // })

            console.log(res.error)


        await request(app).post("/api/users/logout").send({
            username: "test",
            password: "pass"
        })
            .expect(200)
            .expect({
                message: "Logged out successfully."
            })

    })

    test('should get user info', async () => {

        await request(app).get("/api/users/1")
            .expect(200)
            .expect({
                user: {
                    id: 1,
                    username: "test",
                    firstName: "Some",
                    lastName: "One"
                }
            })


    })

    test('should update user info properly', async () => {

        await request(app).put("/api/users/1/update").send({
            password: "pass",
            new_password: "passwordChange"
        })
            .expect(200)
            .expect({ message: "Password change successful." })

        await request(app).put("/api/users/1/update").send({
            username: "user",
            password: "pass",
            firstName: "Test",
            lastName: "User"
        })
            .expect(200)
            .expect({ message: "User info updated." })

    })



})
