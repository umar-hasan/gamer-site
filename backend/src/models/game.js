module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('game', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        img_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    })

    Game.associate = (models) => {
        Game.belongsToMany(models.List, {
            through: models.ListGame,
            foreignKey: {
                name: 'gameId',
                field: 'game_id'
            }
        })
    }


    return Game
}
