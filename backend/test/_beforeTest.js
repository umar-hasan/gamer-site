const db = require('../src/models')

afterAll(async () => {
    await db.User.destroy({where: {}})
    await db.ListGame.destroy({where: {}})
    await db.List.destroy({where: {}})
    await db.Game.destroy({where: {}})
})

function setupTest() {
    process.env.NODE_ENV = "test"
    process.env.SECRET_KEY = "secret"
    process.env.DATABASE_URL = "postgres:///gamer_test"
}

module.exports = { setupTest }