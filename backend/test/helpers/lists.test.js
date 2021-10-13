const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/models');

const { setupTest } = require('../_beforeTest');
const { checkAndRemoveGames } = require('../../src/helpers/lists')

beforeAll(async () => {
    setupTest()
    await db.sequelize.sync({force: true})
    try {
        await db.User.create({
            username: "user",
            password: "pass",
            firstName: "Test",
            lastName: "User"
        })


    } catch (error) {
        console.error(error)
    }
    try {
        await db.List.create({
            id: 12345,
            userId: 1,
            name: "List",
            description: ""
        })
    } catch (error) {
        console.error(error)
    }
    try {
        await db.Game.create({
            id: 67890,
            name: "Game",
            img_url: null
        })
    } catch (error) {
        console.error(error)
    }
    try {
        await db.ListGame.create({
            listId: 12345,
            gameId: 67890
        })
    } catch (error) {
        console.error(error)
    }

})

afterAll(async () => {
    await db.sequelize.drop()
    await db.sequelize.close()
})

test('checkAndRemoveGames does not remove a game when it is in a list', async () => {

    let user = await db.User.findOne({
        where: {
            username: "user"
        }
    })
    let list = await db.List.findOne({
        where: {
            id: 12345
        },
        include: {
            model: db.Game,
            as: 'games'
        }
    })
    checkAndRemoveGames(67890)
    expect(list.games.length).toEqual(1)




    list = await db.List.findOne({
        where: {
            id: 12345
        },
        include: {
            model: db.Game,
            as: 'games'
        }
    })
    let game = await db.Game.findOne({
        where: {
            id: 67890
        }
    })
    expect(list.games.length).toEqual(1)




    await db.ListGame.destroy({
        where: {
            listId: 12345
        }
    })

    await checkAndRemoveGames(67890)

    game = await db.Game.findOne({
        where: {
            id: 67890
        }
    })

    list = await db.List.findOne({
        where: {
            id: 12345
        },
        include: {
            model: db.Game,
            as: 'games'
        }
    })

    expect(game).toBe(null)
    expect(list.games.length).toEqual(0)


})




