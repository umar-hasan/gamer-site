const request = require('supertest');
const app = require('../../src/server');
const bcrypt = require('bcrypt')
const { createToken, getUserInfo } = require('../../src/helpers/token')
const { correctUser, loggedIn } = require('../../src/middleware/auth')
const db = require('../../src/models');
const axios = require('axios')

const { setupTest } = require('../_beforeTest');


jest.mock('../../src/helpers/token', () => ({
    createToken: jest.fn(() => "token"),
    getUserInfo: jest.fn(() => ({ id: 1 }))
}))

jest.mock('../../src/middleware/auth', () => ({
    correctUser: jest.fn((req, res, next) => next()),
    loggedIn: jest.fn((req, res, next) => next())
}))

jest.mock('bcrypt', () => ({
    compare: jest.fn((p1, p2) => p1),
    hash: jest.fn((p, n) => "passwordChange")
}))

jest.mock('axios')

describe('testing lists routes', () => {

    beforeAll(async () => {
        try {
            await db.sequelize.sync({ force: true })
        } catch (error) {
            console.error(error)
        }

        db.sequelize.query('ALTER SEQUENCE "user_id_seq" RESTART WITH 1;')

        try {
            await db.User.create({
                id: 1,
                username: "test",
                password: "pass",
                firstName: "Test",
                lastName: "User"
            })

            await db.Game.create({
                id: 1,
                name: "Game",
                img_url: null
            })

        } catch (error) {
            console.error(error)
        }
    })

    beforeEach(async () => {
        await db.sequelize.sync({ force: true })
    })


    afterAll(async () => {
        await db.sequelize.drop()
        await db.sequelize.close()
    })

    test('should create a new list', async () => {
        await request(app).post("/api/lists/").send({
            name: "List",
            description: "This is a test list."
        })
            .expect(200)
            .expect({
                list: {
                    id: 1,
                    name: "List",
                    description: "This is a test list.",
                    userId: 1,
                    games: []
                }
            })
    })

    test('should get a list for a user', async () => {
        await request(app).get("/api/lists/1/1")
            .expect(200)
            .expect({
                list: {
                    id: 1,
                    name: "List",
                    description: "This is a test list.",
                    userId: 1,
                    games: []
                }
            })
    })


    test('should add a game to a list', async () => {
        await request(app).put("/api/lists/1/1").send({
            name: "List",
            lists: [1]
        })
            .expect(200)
            .expect({
                lists: [
                    {
                        id: 1,
                        name: "List",
                        description: "This is a test list.",
                        games: []
                    }
                ]
            })
    })

    test('should delete a game from a list', async () => {
        await request(app).delete("/api/lists/1/1/1")
            .expect(200)
            .expect({
                updated_list: {
                    id: 1,
                    name: "List",
                    description: "This is a test list.",
                    games: []
                }
            })
    })

    test('should delete a list', async () => {
        await request(app).delete("/api/lists/1/1")
            .expect(200)
            .expect({
                message: "Successfully deleted."
            })
    })



})
