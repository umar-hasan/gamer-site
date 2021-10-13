
function setupTest() {
    process.env.NODE_ENV = "test"
    process.env.DB_URL = "postgres:///gamer_test"
}

module.exports = { setupTest }