// Sets up and initializes Postgres Sequalize database.

const Sequelize = require('sequelize');

require('dotenv').config()

// const database = process.env.DB_NAME
// const username = process.env.DB_USERNAME
// const password = process.env.DB_PASSWORD
// const options = {
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     logging: false
// }

if (process.env.NODE_ENV === "test") {
    process.env.DB_URL = "postgres:///gamer_test"
}
console.log(process.env.DB_URL)

const sequelize = new Sequelize(process.env.DB_URL, {
    logging: false
})

const db = {
    User: require('./user')(sequelize, Sequelize.DataTypes),
    Game: require('./game')(sequelize, Sequelize.DataTypes),
    List: require('./list')(sequelize, Sequelize.DataTypes),
    ListGame: require('./list_game')(sequelize, Sequelize.DataTypes)
}

Object.keys(db).forEach((model) => {
    if ('associate' in db[model]) {
        db[model].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db