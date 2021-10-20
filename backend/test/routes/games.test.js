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


jest.mock('axios', () => ({
    post: (url, str, headers) => ({
        data: [
            {
                name: "game 1",
                versions: [{
                    platform_logo: {
                        image_id: ""
                    },
                    platform_version_release_dates: [
                        {
                            date: 12345678
                        }
                    ],
                    summary: "",
                    company: "N/A"
                }]
            }, "game 2", "game 3"
        ]
    })
}))

describe('tests games routes', () => {

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

            await db.List.create({
                id: 1,
                userId: 1,
                name: "List",
                description: "This is a test list."
            })

            await db.Game.create({
                id: 1,
                name: "Game",
                img_url: null
            })

            await db.ListGame.create({
                listId: 1,
                gameId: 1
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

    test('should work', async () => {
        await request(app).get("/api/games/1/1/img")
            .expect(200)
    })


})
