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
    getUserInfo: () => ({ id: 1 })
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
            await db.sequelize.sync({ alter: true, force: true })
        } catch (error) {
            console.error(error)
        }


        try {
            await db.User.create({
                id: 1,
                username: "test",
                password: "pass",
                firstName: "Test",
                lastName: "User"
            })

            // await db.Game.create({
            //     id: 1,
            //     name: "Game",
            //     img_url: null
            // })

        } catch (error) {
            console.error(error)
        }
    })

    // beforeEach(async () => {
    //     await db.sequelize.sync({ force: true })
    // })



    test('1. should create a new list', async () => {
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

    test('2. should get a list for a user', async () => {
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


    test('3. should update name of a list', async () => {
        await request(app).put("/api/lists/1/1").send({
            name: "List",
            lists: [1]
        })
            .expect(200)
            .expect({
                list: {
                    id: 1,
                    name: "List",
                    description: "This is a test list.",
                    userId: 1
                }

            })
    })

    test('4. should add a game to a list', async () => {
        const res = await request(app).put("/api/lists/1").send({
            name: "Game",
            lists: [1]
        })
            .expect(200)

        const list = await db.List.findOne({
            where: {
                id: 1,
                userId: 1
            },
            include: {
                model: db.Game,
                as: 'games'
            }
        })


        expect(list.games.length).toEqual(1)

    })

    test('5. should delete a game from a list', async () => {
        const res = await request(app).delete("/api/lists/1/1/1")
            .expect(200)
            
            console.log(res.data)

    })

    test('6. should delete a list', async () => {
        await request(app).delete("/api/lists/1/1")
            .expect(200)
            .expect({
                message: "Successfully deleted."
            })
    })

    


})
