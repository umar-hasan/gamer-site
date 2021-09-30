const Game = require("./game")
const List = require("./list")

module.exports = (sequelize, DataTypes) => {
    const ListGame = sequelize.define('list_game', {
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "list_id",
            references: {
                model: List,
                key: "id"
            }
        },
        gameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "game_id",
            references: {
                model: Game,
                key: "id"
            }
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    })

    return ListGame
}
