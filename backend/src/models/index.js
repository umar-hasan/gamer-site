// Sets up and initializes Postgres Sequalize database.

const Sequelize = require('sequelize');

require('dotenv').config()


if (process.env.NODE_ENV === "test") {
    process.env.DATABASE_URL = "postgres:///gamer_test"
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
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